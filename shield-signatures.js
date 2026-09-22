/* =====================================================================
   shield-signatures.js — ALIZON Shield detection data.

   Everything the engine matches against lives here: file-format magic
   numbers, known-bad hashes, byte/string indicators, PE packer section
   names and Windows API groupings. The engine (shield-engine.js) holds
   the parsing and scoring logic and reads all of its knowledge from
   this file, so a signature update never means touching engine code.

   HONEST SCOPE. This is an on-demand scanner. It has no kernel driver,
   no real-time file-system filter and no cloud reputation service, and
   the bundled hash list is deliberately tiny — a browser page cannot
   ship and refresh the multi-million-entry hash sets a commercial
   engine relies on. What it does instead is what actually catches
   novel files: parse the format properly and reason about structure.
   A packed executable that imports WriteProcessMemory and nothing
   else, a .docx that contains a VBA project, base64 that decodes to an
   MZ header — none of those need a hash to be obviously wrong.

   The hash list is user-extensible at runtime (Signatures → Import),
   which is how you would wire it to a real feed such as a MalwareBazaar
   SHA-256 export or your own institutional blocklist.

   SEVERITY. Weights are deliberate, not decorative:
     info      0   worth stating, means nothing on its own
     low       6   common in benign files; only matters in company
     medium   18   unusual; a couple of these together is a real signal
     high     40   rare outside malicious or attacker-staged files
     critical 100  on its own enough to call the file malicious
   Anything that fires on ordinary software gets 'low' no matter how
   alarming it sounds. An engine that shouts at every unsigned binary
   trains its user to ignore it, which is worse than having no scanner.
   ===================================================================== */
(function (root) {
  'use strict';

  /* R(id, severity, scope, anchor, regex, title, why)
     `scope`  limits a rule to a format family so PowerShell rules do not
              fire on a PDF that happens to contain the word "bypass".
     `anchor` is a cheap lowercase literal. The engine does one native
              indexOf for it before ever running the regex, which is what
              keeps a 120-rule sweep over several megabytes fast. */
  function R(id, sev, scope, anchor, re, title, why) {
    return { id: id, sev: sev, scope: scope, anchor: anchor, re: re, title: title, why: why };
  }

  /* ---------------------------------------------------------------
     FILE FORMAT MAGIC
     `off` is the byte offset the signature sits at. `exts` are the
     extensions that legitimately carry this format — the engine
     compares them against the real filename to catch a .jpg that is
     actually an executable. `packed` marks formats that are natively
     compressed or encrypted, so the entropy test knows not to call
     them suspicious for being high-entropy.
     --------------------------------------------------------------- */
  var MAGIC = [
    { id:'pe',     off:0, hex:'4D5A',           label:'Windows executable (MZ/PE)', exts:['exe','dll','sys','scr','ocx','cpl','efi','drv','mui','msstyles','ax','tsp','acm'], family:'exe' },
    { id:'elf',    off:0, hex:'7F454C46',       label:'Linux/Unix executable (ELF)', exts:['elf','so','bin','o','ko',''], family:'exe' },
    { id:'macho64',off:0, hex:'CFFAEDFE',       label:'macOS executable (Mach-O 64-bit)', exts:['dylib','bundle','o',''], family:'exe' },
    { id:'macho32',off:0, hex:'CEFAEDFE',       label:'macOS executable (Mach-O 32-bit)', exts:['dylib','bundle','o',''], family:'exe' },
    { id:'machofat',off:0,hex:'CAFEBABE',       label:'Mach-O universal binary or Java class', exts:['class','dylib',''], family:'exe' },
    { id:'zip',    off:0, hex:'504B0304',       label:'ZIP container', exts:['zip','docx','xlsx','pptx','docm','xlsm','pptm','dotx','xltx','potx','jar','apk','odt','ods','odp','epub','vsix','nupkg','war','ipa','xpi','crx','whl','aar','kmz'], family:'zip', packed:true },
    { id:'zipe',   off:0, hex:'504B0506',       label:'ZIP container (empty)', exts:['zip'], family:'zip', packed:true },
    { id:'zips',   off:0, hex:'504B0708',       label:'ZIP container (spanned)', exts:['zip'], family:'zip', packed:true },
    { id:'ole',    off:0, hex:'D0CF11E0A1B11AE1', label:'Microsoft OLE2 compound file', exts:['doc','xls','ppt','msi','msg','dot','xlt','pot','db','vsd','sst','pub','wiz'], family:'ole' },
    { id:'pdf',    off:0, hex:'25504446',       label:'PDF document', exts:['pdf','fdf','ai'], family:'pdf' },
    { id:'rtf',    off:0, hex:'7B5C7274',       label:'Rich Text Format document', exts:['rtf','doc'], family:'rtf' },
    { id:'rar',    off:0, hex:'526172211A0700', label:'RAR archive (v4)', exts:['rar'], family:'archive', packed:true },
    { id:'rar5',   off:0, hex:'526172211A070100', label:'RAR archive (v5)', exts:['rar'], family:'archive', packed:true },
    { id:'7z',     off:0, hex:'377ABCAF271C',   label:'7-Zip archive', exts:['7z'], family:'archive', packed:true },
    { id:'gzip',   off:0, hex:'1F8B',           label:'gzip stream', exts:['gz','tgz','svgz','gzip'], family:'archive', packed:true },
    { id:'bzip2',  off:0, hex:'425A68',         label:'bzip2 archive', exts:['bz2','tbz','tbz2'], family:'archive', packed:true },
    { id:'xz',     off:0, hex:'FD377A585A00',   label:'XZ archive', exts:['xz','txz'], family:'archive', packed:true },
    { id:'zstd',   off:0, hex:'28B52FFD',       label:'Zstandard archive', exts:['zst','zstd'], family:'archive', packed:true },
    { id:'cab',    off:0, hex:'4D534346',       label:'Microsoft Cabinet archive', exts:['cab'], family:'archive', packed:true },
    { id:'msipatch',off:0,hex:'4D534346',       label:'Microsoft Cabinet archive', exts:['cab','msp'], family:'archive', packed:true },
    { id:'iso',    off:32769, hex:'4344303031', label:'ISO 9660 disc image', exts:['iso','img','udf'], family:'image' },
    { id:'dmg',    off:0, hex:'7801730D626260', label:'Apple disk image', exts:['dmg'], family:'image', packed:true },
    { id:'lnk',    off:0, hex:'4C00000001141402', label:'Windows shortcut (.lnk)', exts:['lnk'], family:'lnk' },
    { id:'class',  off:0, hex:'CAFEBABE',       label:'Java class file', exts:['class'], family:'exe' },
    { id:'dex',    off:0, hex:'6465780A',       label:'Android DEX bytecode', exts:['dex'], family:'exe' },
    { id:'wasm',   off:0, hex:'0061736D',       label:'WebAssembly module', exts:['wasm'], family:'exe' },
    { id:'png',    off:0, hex:'89504E470D0A1A0A', label:'PNG image', exts:['png','apng'], family:'media', packed:true },
    { id:'jpg',    off:0, hex:'FFD8FF',         label:'JPEG image', exts:['jpg','jpeg','jpe','jfif'], family:'media', packed:true },
    { id:'gif87',  off:0, hex:'474946383761',   label:'GIF image', exts:['gif'], family:'media', packed:true },
    { id:'gif89',  off:0, hex:'474946383961',   label:'GIF image', exts:['gif'], family:'media', packed:true },
    { id:'bmp',    off:0, hex:'424D',           label:'Bitmap image', exts:['bmp','dib'], family:'media' },
    { id:'webp',   off:8, hex:'57454250',       label:'WebP image', exts:['webp'], family:'media', packed:true },
    { id:'ico',    off:0, hex:'00000100',       label:'Windows icon', exts:['ico'], family:'media' },
    { id:'tiff1',  off:0, hex:'49492A00',       label:'TIFF image', exts:['tif','tiff','cr2','nef','dng','arw'], family:'media' },
    { id:'tiff2',  off:0, hex:'4D4D002A',       label:'TIFF image', exts:['tif','tiff'], family:'media' },
    { id:'psd',    off:0, hex:'38425053',       label:'Photoshop document', exts:['psd','psb'], family:'media' },
    { id:'mp3id3', off:0, hex:'494433',         label:'MP3 audio (ID3)', exts:['mp3'], family:'media', packed:true },
    { id:'ogg',    off:0, hex:'4F676753',       label:'Ogg media', exts:['ogg','oga','ogv','opus'], family:'media', packed:true },
    { id:'flac',   off:0, hex:'664C6143',       label:'FLAC audio', exts:['flac'], family:'media', packed:true },
    { id:'mp4',    off:4, hex:'66747970',       label:'MP4/QuickTime media', exts:['mp4','m4a','m4v','mov','3gp','heic','heif','avif'], family:'media', packed:true },
    { id:'riff',   off:0, hex:'52494646',       label:'RIFF media (WAV/AVI/WebP)', exts:['wav','avi','webp'], family:'media' },
    { id:'mkv',    off:0, hex:'1A45DFA3',       label:'Matroska media', exts:['mkv','webm','mka'], family:'media', packed:true },
    { id:'sqlite', off:0, hex:'53514C69746520666F726D6174203300', label:'SQLite database', exts:['sqlite','db','sqlite3','db3'], family:'data' },
    { id:'pfx',    off:0, hex:'3082',           label:'DER/PKCS certificate or key', exts:['der','cer','crt','pfx','p12','key'], family:'data' },
    { id:'ttf',    off:0, hex:'0001000000',     label:'TrueType font', exts:['ttf','otf'], family:'media' },
    { id:'otf',    off:0, hex:'4F54544F',       label:'OpenType font', exts:['otf'], family:'media' },
    { id:'woff',   off:0, hex:'774F4646',       label:'WOFF font', exts:['woff'], family:'media', packed:true },
    { id:'woff2',  off:0, hex:'774F4632',       label:'WOFF2 font', exts:['woff2'], family:'media', packed:true },
    { id:'shebang',off:0, hex:'2321',           label:'Script with shebang', exts:['sh','bash','py','pl','rb','zsh','fish','ksh','awk','node','js',''], family:'script' },
    { id:'mhtml',  off:0, hex:'46726F6D3A',     label:'MHTML web archive', exts:['mht','mhtml','eml'], family:'text' },
    { id:'psgz',   off:0, hex:'2D2D2D2D2D424547', label:'PEM-encoded key or certificate', exts:['pem','key','crt','asc','gpg'], family:'data' }
  ];

  /* ---------------------------------------------------------------
     KNOWN-BAD HASHES
     Small on purpose — see the note at the top of this file. EICAR is
     the industry-standard harmless test file every scanner is expected
     to detect; if Shield flags it, the pipeline works end to end.
     --------------------------------------------------------------- */
  var HASHES = {
    sha256: {
      '275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f':
        { name:'EICAR-Test-File', sev:'critical', note:'The EICAR anti-malware test file. Completely harmless — it exists so you can prove a scanner is working without handling real malware.' }
    },
    sha1: {
      '3395856ce81f2b7382dee72602f798b642f14140':
        { name:'EICAR-Test-File', sev:'critical', note:'The EICAR anti-malware test file (SHA-1 match).' }
    }
  };

  /* ---------------------------------------------------------------
     PE PACKER / PROTECTOR SECTION NAMES
     A section named UPX1 does not make a file malicious — plenty of
     legitimate software is packed to save space. It does mean the real
     code is compressed and unreadable until it unpacks itself at
     runtime, which is why it is treated as one signal among several
     rather than a verdict on its own.
     --------------------------------------------------------------- */
  var PACKERS = {
    'UPX0':'UPX', 'UPX1':'UPX', 'UPX2':'UPX', 'UPX!':'UPX', '.UPX0':'UPX', '.UPX1':'UPX',
    '.aspack':'ASPack', '.adata':'ASPack', 'ASPack':'ASPack', '.ASPack':'ASPack',
    '.boom':'BoomBinder', '.ccg':'CCG', '.charmve':'CharmVE', 'BitArts':'BitArts',
    'DAStub':'DAStub', '!EPack':'EPack', 'FSG!':'FSG', '.gentee':'Gentee',
    'kkrunchy':'kkrunchy', '.mackt':'ImpRec', '.MaskPE':'MaskPE', 'MEW':'MEW',
    '.MPRESS1':'MPRESS', '.MPRESS2':'MPRESS', '.neolite':'NeoLite', '.neolit':'NeoLite',
    '.nsp0':'NsPack', '.nsp1':'NsPack', '.nsp2':'NsPack', 'nsp0':'NsPack', 'nsp1':'NsPack',
    '.packed':'Unknown packer', 'pebundle':'PEBundle', 'PEBundle':'PEBundle',
    'PEC2':'PECompact', 'PEC2TO':'PECompact', 'PECompact2':'PECompact', 'pec1':'PECompact',
    '.perplex':'Perplex', 'PESHiELD':'PEShield', '.petite':'Petite', 'ProCrypt':'ProCrypt',
    '.RLPack':'RLPack', 'RCryptor':'RCryptor', '.RPCrypt':'RPCrypt', '.sforce3':'StarForce',
    '.spack':'Simple Pack', '.svkp':'SVKP', 'Themida':'Themida', '.Themida':'Themida',
    '.taz':'Taz', '.tsuarch':'TSULoader', '.tsustub':'TSULoader', '.Upack':'Upack',
    '.vmp0':'VMProtect', '.vmp1':'VMProtect', '.vmp2':'VMProtect', 'VProtect':'VProtect',
    '.winapi':'API Override', 'WinLicen':'WinLicense', '_winzip_':'WinZip SFX',
    '.WWPACK':'WWPack', '.yP':'Y0da Protector', '.y0da':'Y0da Protector',
    '.enigma1':'Enigma', '.enigma2':'Enigma', '.securom':'SecuROM', '.sedata':'SafeDisc',
    '.cexe':'CExe', '.ecode':'Enigma VB', 'kbss':'Kryptor', 'DalKiT':'DalKrypt',
    '.shrink1':'Shrinker', '.shrink2':'Shrinker', '.shrink3':'Shrinker', 'PELOCKnt':'PELock'
  };

  /* ---------------------------------------------------------------
     WINDOWS API GROUPS
     The import table is the most honest thing in a PE file: it is the
     list of operating-system capabilities the binary asked for before
     it ran a single instruction. Individually these are all used by
     legitimate software — debuggers inject code, backup tools read
     other processes, installers write Run keys. The signal is in the
     combination, and in what is asked for versus what the file claims
     to be. A "PDF reader" that imports SetWindowsHookEx and
     GetAsyncKeyState is a keylogger.
     --------------------------------------------------------------- */
  var API_GROUPS = [
    { id:'inject', label:'Process injection', sev:'high', weight:1,
      why:'Writes code into the memory of another running process and starts it there. Used by debuggers and some security products, but it is also the defining behaviour of a code injector.',
      fns:['VirtualAllocEx','WriteProcessMemory','CreateRemoteThread','CreateRemoteThreadEx','NtCreateThreadEx','RtlCreateUserThread','QueueUserAPC','NtQueueApcThread','SetThreadContext','NtSetContextThread','NtMapViewOfSection','NtUnmapViewOfSection','ZwUnmapViewOfSection','NtWriteVirtualMemory','ZwWriteVirtualMemory','VirtualProtectEx','NtAllocateVirtualMemory'] },

    { id:'hollow', label:'Process hollowing', sev:'high', weight:1,
      why:'Starts a legitimate program suspended, replaces its contents, then resumes it — so the malicious code runs under a trusted process name.',
      fns:['CreateProcessInternalW','ResumeThread','SuspendThread','GetThreadContext','WriteProcessMemory','NtResumeThread'] },

    { id:'keylog', label:'Keystroke and input capture', sev:'high', weight:1,
      why:'Reads the keyboard outside the program\u2019s own window. Legitimate in accessibility tools and games; in anything else it is surveillance.',
      fns:['SetWindowsHookExA','SetWindowsHookExW','GetAsyncKeyState','GetKeyboardState','GetKeyState','RegisterRawInputDevices','GetRawInputData','AttachThreadInput','GetForegroundWindow','GetWindowTextA','GetWindowTextW'] },

    { id:'screen', label:'Screen capture', sev:'medium', weight:1,
      why:'Copies the contents of the screen. Normal in screenshot and conferencing tools, notable in anything that has no reason to look at your display.',
      fns:['BitBlt','StretchBlt','CreateCompatibleBitmap','CreateCompatibleDC','GetDC','GetWindowDC','PrintWindow','GetDIBits'] },

    { id:'crypto', label:'Bulk encryption', sev:'medium', weight:1,
      why:'Encrypts data using the Windows crypto providers. Ordinary in backup and security software; combined with file enumeration and shadow-copy deletion it is the ransomware pattern.',
      fns:['CryptEncrypt','CryptDecrypt','CryptGenKey','CryptDeriveKey','CryptAcquireContextA','CryptAcquireContextW','CryptImportKey','BCryptEncrypt','BCryptGenerateSymmetricKey','CryptHashData'] },

    { id:'antidbg', label:'Anti-analysis and anti-debugging', sev:'medium', weight:1,
      why:'Checks whether it is being watched and can change behaviour when it is. Present in commercial anti-piracy protection, and in almost every sample that wants to survive a sandbox.',
      fns:['IsDebuggerPresent','CheckRemoteDebuggerPresent','NtQueryInformationProcess','OutputDebugStringA','OutputDebugStringW','NtSetInformationThread','GetTickCount64','QueryPerformanceCounter','NtQuerySystemInformation','FindWindowA','BlockInput','NtClose'] },

    { id:'persist', label:'Persistence', sev:'medium', weight:1,
      why:'Arranges to be started again automatically after a reboot — registry Run keys, services or scheduled tasks. Expected in installers, unexpected in a document viewer or a one-off tool.',
      fns:['RegSetValueExA','RegSetValueExW','RegCreateKeyExA','RegCreateKeyExW','CreateServiceA','CreateServiceW','OpenSCManagerA','OpenSCManagerW','StartServiceCtrlDispatcherA','ChangeServiceConfigA','ChangeServiceConfig2W','SetFileAttributesA','SetFileAttributesW'] },

    { id:'net', label:'Network communication', sev:'low', weight:1,
      why:'Downloads or uploads data. Utterly routine on its own — it only carries weight alongside injection, persistence or obfuscation.',
      fns:['InternetOpenA','InternetOpenW','InternetOpenUrlA','InternetOpenUrlW','InternetReadFile','InternetConnectA','HttpSendRequestA','HttpSendRequestW','HttpOpenRequestA','URLDownloadToFileA','URLDownloadToFileW','URLDownloadToCacheFileA','WinHttpOpen','WinHttpConnect','WinHttpSendRequest','WSAStartup','WSASocketA','WSASocketW','connect','send','recv','socket','gethostbyname','getaddrinfo','DnsQuery_A'] },

    { id:'priv', label:'Privilege escalation', sev:'medium', weight:1,
      why:'Asks for or borrows rights beyond those the launching user normally has, such as the debug privilege or another account\u2019s token.',
      fns:['AdjustTokenPrivileges','LookupPrivilegeValueA','LookupPrivilegeValueW','OpenProcessToken','ImpersonateLoggedOnUser','DuplicateTokenEx','SetTokenInformation','CreateProcessAsUserA','CreateProcessAsUserW','LogonUserA','LogonUserW'] },

    { id:'dynres', label:'Dynamic API resolution', sev:'low', weight:1,
      why:'Looks functions up by name at runtime rather than importing them. Legitimate plugin hosts do this constantly, but it is also how packed code hides what it intends to call, so it matters most when the visible import table is nearly empty.',
      fns:['LoadLibraryA','LoadLibraryW','LoadLibraryExA','LoadLibraryExW','GetProcAddress','LdrLoadDll','LdrGetProcedureAddress','GetModuleHandleA','GetModuleHandleW'] },

    { id:'memexec', label:'Executable memory allocation', sev:'medium', weight:1,
      why:'Marks a region of its own memory as executable and runs code from it. That is how a packer unpacks, and equally how shellcode is staged.',
      fns:['VirtualAlloc','VirtualProtect','NtProtectVirtualMemory','HeapCreate','MapViewOfFile','CreateFileMappingA','NtCreateSection'] },

    { id:'enum', label:'Process and system enumeration', sev:'low', weight:1,
      why:'Lists running processes or installed software — reconnaissance when paired with injection or evasion, and ordinary housekeeping otherwise.',
      fns:['CreateToolhelp32Snapshot','Process32First','Process32Next','Process32FirstW','Process32NextW','EnumProcesses','EnumProcessModules','OpenProcess','Module32First','Module32Next','GetSystemInfo','GlobalMemoryStatusEx'] },

    { id:'creds', label:'Credential access', sev:'high', weight:1,
      why:'Reads stored passwords, vault entries or the Windows credential store.',
      fns:['CredEnumerateA','CredEnumerateW','CredReadA','CredReadW','CryptUnprotectData','LsaOpenPolicy','LsaRetrievePrivateData','SamConnect','NetUserEnum','WNetEnumResourceA'] },

    { id:'fileops', label:'Mass file enumeration', sev:'low', weight:1,
      why:'Walks the file system looking at every file. Backup, search and antivirus tools do this; so does anything preparing to encrypt or exfiltrate a user\u2019s documents.',
      fns:['FindFirstFileA','FindFirstFileW','FindNextFileA','FindNextFileW','GetLogicalDriveStringsA','GetLogicalDriveStringsW','GetDriveTypeA','SHGetFolderPathA','SHGetKnownFolderPath','MoveFileExA','DeleteFileA','DeleteFileW'] }
  ];

  /* ---------------------------------------------------------------
     CONTENT RULES
     Matched against the file's text, and for PE files also against a
     UTF-16 decoding, because Windows binaries store most of their
     strings wide and a latin-1 search alone would miss them.
     --------------------------------------------------------------- */
  var RULES = [

    /* ---- The test file ------------------------------------------ */
    R('eicar','critical','any','x5o!p%@ap[4', /X5O!P%@AP\[4\\PZX54\(P\^\)7CC\)7\}\$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!\$H\+H\*/,
      'EICAR anti-malware test signature',
      'The standard industry test string. It is harmless by design and does nothing at all when run — its only purpose is to prove a scanner is working. If you did not put this here deliberately, something copied it in.'),

    /* ---- PowerShell --------------------------------------------- */
    R('ps-encoded','high','text','-enc', /powershell(\.exe)?[^\n\r]{0,200}?\s-(enc(odedcommand)?|e|ec)\s+[A-Za-z0-9+\/=]{40,}/i,
      'PowerShell with a base64-encoded command',
      'A PowerShell command passed in base64 so it never appears as readable text in a log or a command line. Administrators occasionally use this to get around quoting problems; attackers use it constantly, for exactly the reason that it hides the payload.'),
    R('ps-hidden','medium','text','-w hidden', /-(w|windowstyle)\s+hidden|-nop\b|-noprofile\b|-noni\b|-noninteractive\b/i,
      'PowerShell launched hidden or without a profile',
      'Flags that suppress the window and skip the user profile. Common in legitimate automation and scheduled tasks; worth noting when they appear inside a document or an email attachment.'),
    R('ps-bypass','high','text','executionpolicy', /-ex(ec(utionpolicy)?)?\s+(bypass|unrestricted)/i,
      'PowerShell execution policy bypass',
      'Explicitly disables the script-signing policy for this run. There is no reason for a document, an installer or an attachment to do this.'),
    R('ps-download','high','text','downloadstring', /(DownloadString|DownloadFile|DownloadData)\s*\(|Net\.WebClient|Invoke-WebRequest|Invoke-RestMethod|Start-BitsTransfer/i,
      'PowerShell downloads content from the internet',
      'Fetches a remote file or script. Alone this is ordinary; paired with Invoke-Expression it is the classic download-and-run pattern where nothing ever touches disk.'),
    R('ps-iex','high','text','invoke-expression', /Invoke-Expression|\bIEX\s*\(|\bIEX\s+\$|\|\s*IEX\b/i,
      'PowerShell executes a string as code',
      'Invoke-Expression runs whatever text it is given as a command. Combined with a download, the downloaded script runs directly in memory and leaves no file for a scanner to find.'),
    R('ps-frombase64','medium','text','frombase64string', /FromBase64String|\[Convert\]::FromBase64|System\.Convert\]::FromBase64/i,
      'Base64 decoding in a script',
      'Decodes embedded base64. Legitimate for binary data in configuration; also the standard way to smuggle a payload past text-based inspection.'),
    R('ps-reflect','high','text','reflection.assembly', /\[Reflection\.Assembly\]::Load|System\.Reflection\.Assembly\]::Load|GetDelegateForFunctionPointer|DefineDynamicAssembly/i,
      'In-memory .NET assembly loading',
      'Loads a .NET program directly from memory, so no executable is ever written to disk. Almost exclusively an offensive-tooling technique.'),
    R('ps-amsi','critical','text','amsi', /amsiInitFailed|AmsiScanBuffer|amsi\.dll|AmsiUtils/i,
      'AMSI (antimalware scan interface) tampering',
      'Touches the Windows interface that lets antivirus inspect scripts before they run. The only reason to reference it from a script is to switch it off.'),
    R('ps-etw','high','text','etweventwrite', /EtwEventWrite|ETWTraceProvider|Set-EtwTraceProvider/i,
      'Event tracing tampering',
      'Interferes with the Windows telemetry that security tools rely on to see what ran.'),

    /* ---- Living-off-the-land binaries ---------------------------- */
    R('lol-mshta','high','text','mshta', /mshta(\.exe)?\s+(https?:|javascript:|vbscript:)/i,
      'mshta executing remote or inline script',
      'mshta.exe is a trusted Windows program that runs HTML applications. Pointing it at a URL or an inline script turns a signed Microsoft binary into a script launcher, which is why attackers reach for it.'),
    R('lol-regsvr','high','text','regsvr32', /regsvr32(\.exe)?[^\n\r]{0,80}(\/i:|scrobj\.dll|https?:)/i,
      'regsvr32 scriptlet execution (Squiblydoo)',
      'Abuses the DLL registration tool to fetch and run a remote scriptlet. A well-documented application-allowlist bypass with no legitimate equivalent.'),
    R('lol-certutil','high','text','certutil', /certutil(\.exe)?[^\n\r]{0,120}(-urlcache|-decode|-encode|-f\s+-split|-verifyctl)/i,
      'certutil used to download or decode a file',
      'certutil is a certificate utility. Using it to fetch a URL or base64-decode a file is a deliberate choice to avoid tools that are actually monitored.'),
    R('lol-rundll','high','text','rundll32', /rundll32(\.exe)?\s+(javascript:|\S+\.dll,\s*\w+\s+https?:|url\.dll,\s*(FileProtocolHandler|OpenURL))/i,
      'rundll32 executing script or a remote resource',
      'Another signed Windows binary repurposed to run attacker-controlled code.'),
    R('lol-bitsadmin','medium','text','bitsadmin', /bitsadmin(\.exe)?\s+\/(transfer|create|addfile)/i,
      'File transfer via BITS',
      'Uses the background transfer service to download files. Legitimate for updates; favoured by attackers because the download survives reboots and is attributed to a system service.'),
    R('lol-wmic','medium','text','wmic', /wmic\s+(process\s+call\s+create|\/node:|os\s+get|shadowcopy\s+delete)/i,
      'WMIC used to launch processes or query the system',
      'Command-line WMI. Used by administrators, and by attackers for exactly the same reasons — it runs things remotely and is present everywhere.'),
    R('lol-msbuild','high','text','msbuild', /msbuild(\.exe)?[^\n\r]{0,120}\.(xml|csproj|proj)\b|<\s*Task\s+[^>]*Evaluate/i,
      'MSBuild used as a code execution host',
      'MSBuild compiles and runs C# embedded in a project file. Since it ships signed with Windows and .NET, it is a common way to run code where unsigned binaries would be blocked.'),
    R('lol-installutil','high','text','installutil', /installutil(\.exe)?\s+\/logfile=|InstallUtil\.exe\s+\/U/i,
      'InstallUtil used to run code',
      'A .NET installer utility abused to execute an assembly\u2019s uninstall method, bypassing allowlisting.'),

    /* ---- Destructive and ransomware behaviour -------------------- */
    R('ransom-vss','critical','text','vssadmin', /vssadmin(\.exe)?[^\n\r]{0,80}delete\s+shadows|wmic\s+shadowcopy\s+delete|Get-WmiObject\s+Win32_Shadowcopy[^\n\r]{0,60}Delete/i,
      'Deletes Volume Shadow Copies',
      'Destroys the Windows restore points that let you roll files back. Ransomware does this so that paying is the only option. Nothing legitimate needs to wipe every shadow copy on a machine.'),
    R('ransom-bcd','critical','text','bcdedit', /bcdedit[^\n\r]{0,120}(recoveryenabled\s+no|bootstatuspolicy\s+ignoreallfailures)/i,
      'Disables Windows recovery',
      'Turns off the automatic repair that would otherwise let the machine heal itself after the damage is done. A standard ransomware preparation step.'),
    R('ransom-wbadmin','critical','text','wbadmin', /wbadmin[^\n\r]{0,60}delete\s+(catalog|systemstatebackup|backup)/i,
      'Deletes Windows backup catalogue',
      'Removes the backup history so previous versions cannot be restored.'),
    R('ransom-note','medium','text','your files have been', /your\s+files\s+have\s+been\s+(encrypted|locked)|all\s+your\s+files\s+are\s+encrypted|to\s+decrypt\s+your\s+files|\.onion\/[a-z0-9]{16}/i,
      'Text resembling a ransom note',
      'Wording characteristic of an extortion message. Can appear innocently in security training material or an incident report, so read the file before acting.'),
    R('destruct-format','high','text','format ', /\bformat\s+[a-z]:\s*\/(y|q|fs)|diskpart[^\n\r]{0,40}clean\s+all|\bcipher\s+\/w:/i,
      'Disk wiping or formatting command',
      'Erases a drive or overwrites free space irrecoverably.'),
    R('destruct-fork','high','text',':(){', /:\(\)\s*\{\s*:\|\s*:\s*&\s*\}\s*;\s*:/,
      'Shell fork bomb',
      'A one-line shell function that replicates until the machine runs out of processes. Denial of service, not data theft, but it will take the host down.'),
    R('destruct-rmrf','high','text','rm -rf', /rm\s+-rf\s+(\/|\$HOME|~)(\s|$|\*)|rm\s+-rf\s+--no-preserve-root/i,
      'Recursive delete of a root or home directory',
      'Deletes everything under the given path without prompting.'),
    R('destruct-dd','high','text','dd if=', /dd\s+if=\/dev\/(zero|u?random)\s+of=\/dev\/[sh]d[a-z]/i,
      'Raw overwrite of a block device',
      'Writes zeroes or noise directly over a disk, destroying the partition table and everything on it.'),

    /* ---- Persistence --------------------------------------------- */
    R('persist-run','medium','text','currentversion\\run', /(HKCU|HKLM|HKEY_CURRENT_USER|HKEY_LOCAL_MACHINE)[\\\/]+Software[\\\/]+(Wow6432Node[\\\/]+)?Microsoft[\\\/]+Windows[\\\/]+CurrentVersion[\\\/]+Run(Once|Services)?/i,
      'Writes a Windows Run key',
      'Registers a program to start at every login. Standard installer behaviour, and equally standard malware behaviour — what matters is whether this file has any business installing anything.'),
    R('persist-schtask','medium','text','schtasks', /schtasks(\.exe)?\s+\/create|Register-ScheduledTask|New-ScheduledTaskAction/i,
      'Creates a scheduled task',
      'Schedules something to run later or repeatedly, surviving reboots.'),
    R('persist-startup','medium','text','start menu\\programs\\startup', /Start\s*Menu[\\\/]+Programs[\\\/]+Startup|shell:startup/i,
      'Writes to the Startup folder',
      'Anything placed here runs at login.'),
    R('persist-service','medium','text','sc create', /\bsc(\.exe)?\s+create\s+\w+|New-Service\s+-Name/i,
      'Creates a Windows service',
      'Services start before login and run with high privilege.'),
    R('persist-wmi','high','text','__eventfilter', /__EventFilter|CommandLineEventConsumer|__FilterToConsumerBinding|ActiveScriptEventConsumer/i,
      'WMI event subscription persistence',
      'Hides a trigger in the WMI repository so code runs on an event such as a login or a timer. It leaves no file and no registry key, which is exactly why it is used.'),
    R('persist-cron','low','text','crontab', /crontab\s+-|\/etc\/cron\.(d|daily|hourly)|@reboot\s+/i,
      'Creates a cron job',
      'Schedules recurring execution on a Unix-like system.'),
    R('persist-systemd','low','text','systemctl enable', /systemctl\s+enable|\/etc\/systemd\/system\/[\w.-]+\.service/i,
      'Installs a systemd service',
      'Registers a program to start with the system on Linux.'),

    /* ---- Script obfuscation -------------------------------------- */
    R('obf-evalunescape','high','text','eval(unescape', /eval\s*\(\s*(unescape|atob|decodeURIComponent|String\.fromCharCode)/i,
      'Code executed straight from a decoder',
      'The script decodes text and immediately runs it. Minifiers never do this; obfuscators and droppers always do.'),
    R('obf-newfunction','medium','text','new function', /new\s+Function\s*\(\s*(atob|unescape|decodeURIComponent|["'][A-Za-z0-9+\/=]{60,})/i,
      'Function body built from decoded text',
      'Builds executable code at runtime out of an encoded string.'),
    R('obf-charcode','medium','text','fromcharcode', /String\.fromCharCode\s*\(\s*(\d{1,3}\s*,\s*){15,}/i,
      'Long character-code array',
      'A string assembled one character code at a time so the text never appears literally in the file.'),
    R('obf-docwrite','medium','text','document.write(unescape', /document\.write\s*\(\s*(unescape|atob|String\.fromCharCode)/i,
      'Page content written from decoded text',
      'Injects decoded markup or script into the page.'),
    R('obf-activex','medium','text','activexobject', /new\s+ActiveXObject\s*\(\s*["'](WScript\.Shell|Scripting\.FileSystemObject|MSXML2\.XMLHTTP|ADODB\.Stream|Shell\.Application|WbemScripting)/i,
      'Script creating a Windows automation object',
      'Reaches out of the browser sandbox to the shell, the file system or the network. In a .js or .hta file delivered by email this is the entire attack.'),
    R('obf-wscript','high','text','wscript.shell', /WScript\.Shell|WScript\.CreateObject|\.Run\s*\(\s*["'][^"']{0,200}(cmd|powershell|mshta|cscript)/i,
      'Windows Script Host shell execution',
      'Runs an arbitrary command through the Windows Script Host.'),
    R('obf-adodb','high','text','adodb.stream', /ADODB\.Stream|\.SaveToFile\s*\(|MSXML2\.(XMLHTTP|ServerXMLHTTP)/i,
      'Script downloading and saving a file',
      'The standard scripted download-to-disk pattern used by droppers.'),
    R('obf-hex','medium','text','\\x', /(\\x[0-9a-f]{2}){30,}/i,
      'Long run of hex escapes',
      'Thirty or more consecutive hex-escaped bytes. Legitimate code escapes the odd character; this is a string deliberately made unreadable.'),
    R('obf-unicode','medium','text','\\u00', /(\\u00[0-9a-f]{2}){30,}/i,
      'Long run of unicode escapes',
      'The same idea as hex escaping, in a different notation.'),
    R('obf-selfdecode','high','text','atob(', /atob\s*\(\s*["'][A-Za-z0-9+\/=]{200,}["']\s*\)/,
      'Very large inline base64 blob decoded at runtime',
      'A base64 string long enough to be a program, decoded by the script itself.'),

    /* ---- Web shells ---------------------------------------------- */
    R('shell-php','critical','text','$_post', /(eval|assert|system|exec|shell_exec|passthru|popen|proc_open)\s*\(\s*\$_(POST|GET|REQUEST|COOKIE|SERVER)/i,
      'PHP web shell',
      'Takes whatever arrives in a web request and executes it as code or as a shell command. This is remote control of the server by anyone who can reach the page — there is no benign version of this pattern.'),
    R('shell-phpb64','high','text','base64_decode', /eval\s*\(\s*(base64_decode|gzinflate|str_rot13|gzuncompress|strrev)\s*\(/i,
      'PHP executing decoded or decompressed code',
      'Obfuscated PHP that unwraps itself before running. Overwhelmingly a backdoor.'),
    R('shell-phppreg','critical','text','preg_replace', /preg_replace\s*\(\s*["'][^"']*\/[a-z]*e[a-z]*["']/i,
      'PHP preg_replace with the /e modifier',
      'A removed PHP feature that executed the replacement as code. Its only remaining use is as a backdoor.'),
    R('shell-aspx','critical','text','request.item', /(eval|Execute)\s*\(\s*Request(\.Item)?\s*\[|Process\.Start\s*\(\s*Request/i,
      'ASP/ASPX web shell',
      'The .NET equivalent: executes content supplied in the HTTP request.'),
    R('shell-jsp','critical','text','getruntime().exec', /Runtime\.getRuntime\(\)\.exec\s*\(\s*request\.getParameter|ProcessBuilder\s*\([^)]*request\.getParameter/i,
      'JSP web shell',
      'Runs an operating-system command taken from a web request parameter.'),
    R('shell-reverse','critical','text','/dev/tcp/', /\/dev\/tcp\/[\d.]+\/\d+|nc\s+(-[a-z]*e[a-z]*)\s+\/bin\/(ba)?sh|bash\s+-i\s*>&\s*\/dev\/tcp/i,
      'Reverse shell',
      'Opens an interactive shell back out to an attacker-controlled address, which sidesteps any inbound firewall rule.'),
    R('shell-pyrev','critical','text','socket.socket', /socket\.socket\([^)]*\)[\s\S]{0,200}?(connect\s*\([^)]*\)[\s\S]{0,200}?)?(dup2|subprocess\.call\s*\(\s*\[\s*["']\/bin\/(ba)?sh|pty\.spawn)/i,
      'Python reverse shell',
      'Connects out to a remote host and hands it a shell.'),

    /* ---- Office documents ----------------------------------------- */
    R('vba-autoexec','high','office','autoopen', /\b(AutoOpen|AutoExec|AutoClose|AutoNew|Document_Open|Document_Close|Document_New|Workbook_Open|Workbook_Activate|Workbook_BeforeClose|Auto_Open|Auto_Close)\b/,
      'Macro that runs automatically on open',
      'A VBA entry point Office calls by itself when the document is opened or closed. A macro that waits to be clicked is a tool; a macro that runs the instant you open the file is how malicious documents work.'),
    R('vba-shell','critical','office','shell', /\bShell\s*\(|\bShell\s+["']|CreateObject\s*\(\s*["'](WScript\.Shell|Shell\.Application|Scripting\.FileSystemObject|MSXML2)/i,
      'Macro launching an external program',
      'VBA inside a document starting a process outside Word or Excel. A document should not need to run programs.'),
    R('vba-download','critical','office','urldownloadtofile', /URLDownloadToFile|XMLHTTP|WinHttp\.WinHttpRequest|ServerXMLHTTP|\.Open\s+["']GET["']/i,
      'Macro downloading from the internet',
      'The document fetches a second-stage payload. This is the standard maldoc delivery chain: open document, macro runs, real malware is downloaded.'),
    R('vba-declare','high','office','declare', /Declare\s+(PtrSafe\s+)?(Function|Sub)\s+\w+\s+Lib\s+["']/i,
      'Macro declaring a Windows API call',
      'Reaches straight into the Windows API from VBA, bypassing everything Office would otherwise mediate.'),
    R('vba-powershell','critical','office','powershell', /powershell|pwsh\.exe|cmd\.exe\s*\/c|cmd\s*\/k/i,
      'Macro invoking a command shell',
      'The document is trying to run shell commands.'),
    R('vba-strreverse','medium','office','strreverse', /StrReverse\s*\(|Chr\s*\(\s*\d+\s*\)\s*&\s*Chr\s*\(|\bXor\s+\d+/i,
      'Obfuscated VBA string building',
      'Strings reversed or built character by character so the document\u2019s real intent is not visible to a quick inspection.'),
    R('dde-auto','high','office','ddeauto', /DDEAUTO\s|DDE\s+["']?c:|\\\\ddeauto|QUOTE\s+\d+\s+\d+\s+\d+/i,
      'DDE field execution',
      'A field code that makes Office execute a program without any macro at all. Microsoft disabled it by default precisely because it was being used this way.'),
    R('equation-exploit','critical','office','equation.3', /Equation\.3|EQNEDT32|\x1c\x00\x00\x00\x02\x00[\s\S]{0,8}\x0c\x43/i,
      'Equation Editor object (CVE-2017-11882 territory)',
      'The legacy Equation Editor was the subject of a long-exploited memory-corruption bug. Its component was retired by Microsoft, so a document still embedding one in 2026 is far more likely to be an exploit than mathematics.'),
    R('template-inject','high','office','attachedtemplate', /attachedTemplate[^>]{0,200}Target="https?:|TargetMode="External"[^>]{0,120}attachedTemplate/i,
      'Remote template injection',
      'The document pulls its template from a web address when opened, which is how macros get delivered from a file that itself contains none.'),
    R('follina','critical','office','mhtml:', /mhtml:https?:[^\s"']{0,300}!x-usc:|ms-msdt:\/id\s+PCWDiagnostic/i,
      'MSDT/MHTML remote code execution pattern (Follina family)',
      'A remote HTML payload reached through the MSDT diagnostic handler. This is an exploit chain, not a feature.'),
    R('xlm-macro','high','office','excel 4.0', /Excel\s?4\.0\s?(Macro|Intl)|xl\/macrosheets\/|_xlfn\.|\bEXEC\s*\(|\bCALL\s*\(\s*["']/i,
      'Excel 4.0 (XLM) macro sheet',
      'A macro format from 1992 that Excel still honours. It predates the VBA security model and was heavily abused for that reason.'),
    R('ole-package','high','office','ole10native', /Ole10Native|\x01Ole10Native|oleObject\d+\.bin|package\x00/i,
      'Embedded OLE package object',
      'An arbitrary file embedded inside the document, which the user is typically social-engineered into double-clicking.'),

    /* ---- PDF ------------------------------------------------------ */
    R('pdf-js','high','pdf','/javascript', /\/JavaScript|\/JS\s*[<\(\[]|\/JS\s+\d+\s+\d+\s+R/,
      'JavaScript embedded in the PDF',
      'PDFs can carry scripts. Forms and calculations use this legitimately, but it is also the delivery mechanism for every PDF reader exploit.'),
    R('pdf-openaction','high','pdf','/openaction', /\/OpenAction|\/AA\s*<</,
      'Action that fires when the document opens',
      'Something happens the moment the file is opened, with no click required.'),
    R('pdf-launch','critical','pdf','/launch', /\/Launch\s*<<|\/Launch\s+\d/,
      'PDF launching an external program',
      'A /Launch action starts another application. Readers warn about this, but the warning is easy to talk a user past.'),
    R('pdf-embedded','medium','pdf','/embeddedfile', /\/EmbeddedFile|\/Filespec|\/FileAttachment/,
      'File attached inside the PDF',
      'The PDF carries another file. Worth extracting and scanning separately — Shield cannot see inside it from here.'),
    R('pdf-hexname','high','pdf','#6a', /\/[A-Za-z]*#[0-9a-f]{2}[A-Za-z#0-9]*\s*(<<|\[|\d)/i,
      'Hex-escaped PDF names',
      'PDF allows characters in names to be written as #hh escapes. Writing /JavaScript as /J#61vaScript changes nothing for the reader and defeats a naive text search — which is the only reason to do it.'),
    R('pdf-jbig2','medium','pdf','/jbig2decode', /\/JBIG2Decode/,
      'JBIG2 image compression',
      'A rarely used codec with a history of serious parser vulnerabilities.'),
    R('pdf-richmedia','medium','pdf','/richmedia', /\/RichMedia|\/Flash\b|\/3D\s*<</,
      'Embedded rich media',
      'Flash or 3D content inside a PDF — long-deprecated formats with a poor security record.'),
    R('pdf-gotoe','high','pdf','/gotoe', /\/GoToE|\/GoToR\s*<</,
      'Embedded-file or remote go-to action',
      'Navigates into an embedded or remote file, a known way to get a payload opened.'),

    /* ---- HTML smuggling and phishing ------------------------------ */
    R('html-metarefresh','medium','text','http-equiv="refresh"', /<meta[^>]+http-equiv\s*=\s*["']?refresh["']?[^>]+(data:|javascript:)/i,
      'Meta refresh to a data or script URL',
      'Immediately redirects into inline content rather than a real page.'),
    R('html-iframe','medium','text','<iframe', /<iframe[^>]+(width\s*=\s*["']?[0-2]["']?|height\s*=\s*["']?[0-2]["']?|style\s*=\s*["'][^"']*display\s*:\s*none)/i,
      'Hidden iframe',
      'A frame sized to nothing or explicitly hidden. Used to load something the visitor is not meant to notice.'),
    R('phish-exfilform','high','text','type="password"', /<input[^>]+type\s*=\s*["']?password[\s\S]{0,4000}?(api\.telegram\.org\/bot|discord(app)?\.com\/api\/webhooks|hooks\.slack\.com\/services|formspree\.io|getform\.io|webhook\.site)/i,
      'Password field wired to a third-party webhook',
      'A password input whose value is sent to a chat or form-relay endpoint rather than to an application back end. That is a credential-harvesting page: the branding looks right and the password is delivered to somebody else. An ordinary login form posting to its own server does not match this.'),

    /* ---- Shell and dropper patterns -------------------------------- */
    R('sh-curlpipe','high','text','curl', /(curl|wget)\s+[^\n\r|]{0,200}\|\s*(sudo\s+)?(ba|z|k)?sh\b/i,
      'Download piped straight into a shell',
      'Fetches a script from the internet and executes it without it ever being read or saved. Some vendors genuinely publish installers this way, which is what makes it such an effective disguise.'),
    R('sh-chmodx','low','text','chmod', /chmod\s+(\+x|[0-7]*7[0-7]*)\s+/i,
      'Makes a file executable',
      'Routine in build scripts; notable in a downloader.'),
    R('sh-base64pipe','high','text','base64 -d', /base64\s+(-d|--decode|-D)[^\n\r|]{0,80}\|\s*(ba|z)?sh|echo\s+[A-Za-z0-9+\/=]{60,}\s*\|\s*base64\s+-d/i,
      'Base64-decoded command piped to a shell',
      'Hides the command from casual inspection and from anything matching on command-line text.'),
    R('sh-histoff','medium','text','histfile', /unset\s+HISTFILE|export\s+HISTSIZE=0|set\s+\+o\s+history|history\s+-c/i,
      'Disables or clears shell history',
      'Covers the tracks of what was typed. Administrators do this to keep secrets out of logs; intruders do it for the opposite reason.'),
    R('sh-sudoers','high','text','/etc/sudoers', /\/etc\/sudoers|visudo|NOPASSWD:\s*ALL/i,
      'Modifies sudo privileges',
      'Grants password-free administrative rights.'),
    R('sh-sshkey','high','text','authorized_keys', /authorized_keys|\.ssh\/id_(rsa|ed25519)|ssh-rsa\s+AAAA/i,
      'Touches SSH keys or authorised_keys',
      'Either stealing private keys or installing a backdoor public key for persistent remote access.'),

    /* ---- Credential and data theft ---------------------------------- */
    R('cred-browser','high','text','login data', /[\\\/"'](Login\s?Data|Web\s?Data)\b|\blogins\.json\b|\bkey[34]\.db\b|\bcookies\.sqlite\b|Local\s+State[\s\S]{0,40}encrypted_key|User\s?Data[\\\/]+Default[\\\/]/i,
      'Reads browser credential stores',
      'The specific files where Chrome, Edge and Firefox keep saved passwords, cookies and session tokens \u2014 an infostealer\u2019s shopping list. Only matched in path form, so the ordinary English phrase "login data" in a comment or a log message does not trigger it.'),
    R('cred-wallet','high','text','wallet.dat', /wallet\.dat|MetaMask|Exodus\\exodus\.wallet|Electrum\\wallets|keystore\/UTC--/i,
      'Reads cryptocurrency wallet files',
      'Targets wallet data, which is irreversible once taken.'),
    R('cred-mimikatz','critical','text','sekurlsa', /sekurlsa|mimikatz|logonpasswords|lsadump|kerberos::golden|privilege::debug/i,
      'Credential dumping tool',
      'Commands specific to Mimikatz, the standard tool for extracting passwords and tickets from Windows memory.'),
    R('cred-lsass','high','text','lsass', /lsass\.exe|MiniDumpWriteDump|comsvcs\.dll[,\s]+MiniDump|procdump[^\n\r]{0,40}lsass/i,
      'Dumps the LSASS process',
      'LSASS holds credentials in memory. Dumping it is how they get stolen wholesale.'),
    R('exfil-telegram','medium','text','api.telegram.org', /api\.telegram\.org\/bot[\d]+:|discord(app)?\.com\/api\/webhooks\/|hooks\.slack\.com\/services\//i,
      'Hard-coded chat webhook',
      'A bot endpoint used as a drop point for stolen data — cheap, encrypted and indistinguishable from ordinary traffic.'),
    R('exfil-paste','low','text','pastebin', /pastebin\.com\/raw\/|paste\.ee\/r\/|ghostbin|transfer\.sh|anonfiles|0x0\.st|file\.io/i,
      'Anonymous file or paste host',
      'Commonly used to stage payloads or receive stolen data without attribution.'),

    /* ---- Anti-analysis --------------------------------------------- */
    R('evade-vm','medium','any','vmware', /VMware|VirtualBox|VBoxService|QEMU|Xen\s?Source|Sandboxie|SbieDll|wine_get_unix|vboxguest|\bvmtoolsd\b/i,
      'Checks for a virtual machine or sandbox',
      'Looks for the artefacts of an analysis environment. Legitimate software sometimes does this for licensing or driver reasons, but combined with obfuscation it means the file intends to behave differently when nobody is watching.'),
    R('evade-sleep','low','any','sleep', /Sleep\s*\(\s*\d{6,}\s*\)|Start-Sleep\s+-s\s+\d{3,}|timeout\s+\/t\s+\d{3,}/i,
      'Long deliberate delay',
      'Waits out the few minutes an automated sandbox is willing to spend on a sample.'),
    R('evade-defender','critical','text','add-mppreference', /Add-MpPreference\s+-ExclusionPath|Set-MpPreference\s+-Disable|DisableRealtimeMonitoring|DisableAntiSpyware|MpCmdRun[^\n\r]{0,40}-RemoveDefinitions|sc\s+(stop|delete)\s+WinDefend/i,
      'Disables or excludes paths from Windows Defender',
      'Turning off the resident antivirus, or carving out a folder it will not look at, immediately before dropping a file there.'),
    R('evade-firewall','high','text','netsh advfirewall', /netsh\s+advfirewall\s+set\s+\w+\s+state\s+off|netsh\s+firewall\s+set\s+opmode\s+disable|Set-NetFirewallProfile[^\n\r]{0,60}-Enabled\s+False/i,
      'Disables the Windows firewall',
      'Removes the outbound and inbound controls that would otherwise constrain what follows.'),
    R('evade-hosts','medium','text','drivers\\etc\\hosts', /drivers[\\\/]+etc[\\\/]+hosts|\/etc\/hosts\b/i,
      'Modifies the hosts file',
      'Redirects or blackholes domain names — used both to block security vendors\u2019 update servers and to hijack traffic.'),

    /* ---- Network indicators ------------------------------------------ */
    R('net-rawip','low','any','http://', /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?\//,
      'Hard-coded URL with a raw IP address',
      'A literal IP instead of a hostname. Ordinary inside infrastructure code, notable in a document or a script because it skips DNS-based blocking.'),
    R('net-onion','medium','any','.onion', /\b[a-z2-7]{16,56}\.onion\b/i,
      'Tor hidden service address',
      'Command-and-control or a payment site that cannot be taken down or traced conventionally.'),
    R('net-dyndns','low','any','duckdns', /\b[\w-]+\.(duckdns\.org|no-ip\.(org|com|biz)|ddns\.net|hopto\.org|serveo\.net|ngrok\.io|trycloudflare\.com)\b/i,
      'Dynamic DNS or tunnelling hostname',
      'Free, disposable hostnames and tunnels that let an operator move quickly and keep no lasting registration.'),

    /* ---- Generic shellcode ------------------------------------------- */
    R('sc-nopsled','high','any','\u0090\u0090\u0090\u0090', /\x90{40,}/,
      'NOP sled',
      'A long run of do-nothing instructions used to give an exploit a large target to land in. Practically never occurs by accident in this quantity.'),
    R('sc-metasploit','critical','any','meterpreter', /meterpreter|metasploit|msfvenom|windows\/shell_reverse_tcp|\/reverse_(tcp|https?)\b/i,
      'Offensive framework artefact',
      'Names specific to Metasploit payloads. Legitimate on a penetration tester\u2019s machine and nowhere else.'),
    R('sc-cobalt','critical','any','beacon.dll', /beacon\.(dll|x64\.dll)|ReflectiveLoader|cobaltstrike|malleable|\bstager\b[\s\S]{0,40}\bbeacon\b/i,
      'Cobalt Strike artefact',
      'Strings characteristic of the Cobalt Strike post-exploitation framework, which is licensed commercially and pirated constantly.')
  ];

  /* Extensions Windows will execute on a double-click. Not malicious in
     themselves — the point is that the risk of being wrong about one of
     these is far higher than for a .txt. */
  var EXEC_EXT = ['exe','com','scr','pif','bat','cmd','vbs','vbe','js','jse','wsf','wsh','hta',
                  'msi','msp','cpl','jar','ps1','psm1','ps1xml','lnk','reg','inf','sct','dll',
                  'gadget','msc','ade','adp','application','appref-ms','chm','ins','isp','job',
                  'mde','mdb','sh','bash','py','pyc','pyw','rb','pl','apk','dmg','app','command',
                  'workflow','terminal','out','elf','ko','sys','efi','vbscript','url','settingcontent-ms'];

  /* Formats a user is most likely to be sent and least likely to inspect. */
  var LURE_EXT = ['pdf','doc','docx','xls','xlsx','ppt','pptx','txt','rtf','jpg','jpeg','png',
                  'gif','zip','rar','mp3','mp4','avi','csv','htm','html','xml','json','odt'];

  root.SHIELD_SIG = {
    version: '1.0.0',
    built: '2026-09-22',
    magic: MAGIC,
    hashes: HASHES,
    packers: PACKERS,
    apiGroups: API_GROUPS,
    rules: RULES,
    execExt: EXEC_EXT,
    lureExt: LURE_EXT,
    weights: { info:0, low:6, medium:18, high:40, critical:100 },
    /* Score bands. Tuned so that a single 'high' finding reads as
       suspicious rather than malicious: one unusual trait is a reason to
       look closer, not a conviction. Two highs, or anything critical,
       crosses the line. */
    bands: { malicious:80, suspicious:30, low:10 }
  };

})(typeof self !== 'undefined' ? self : this);
