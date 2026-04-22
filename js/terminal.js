/**
 * Jamaisvu Terminal Logic - Ultimate Hacker Edition
 */
document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('cmd-input');
    const cmdText = document.getElementById('cmd-text');
    const outputBox = document.getElementById('output');
    const terminal = document.getElementById('terminal');

    // 终端状态与历史记录
    const promptString = '<span class="prompt">[grayfalcon@jamaisvu ~]$ </span>';
    let commandHistory = [];
    let historyIndex = -1;

    // 基础命令字典
    const commands = {
        'help': 'Available commands: <span class="highlight">whoami</span>, <span class="highlight">skills</span>, <span class="highlight">ls</span>, <span class="highlight">status</span>, <span class="highlight">date</span>, <span class="highlight">who</span>, <span class="highlight">clear</span>, <span class="highlight">exit</span>',
        'whoami': 'Jamaisvu: A 3rd-year CS student & Backend Intern.\nCurrently wrestling with Go, Raft, and Distributed Systems.',
        'skills': 'Languages: Go (Main), C, Java (Learning)\nInfrastructure: Fedora, Docker, Kubernetes, RabbitMQ\nTech: Distributed Consensus, Saga Pattern.',
        'status': `System: Jamaisvu OS v1.0.4-Loom\nUptime: ${Math.floor(Math.random() * 1000)} days, 4:20, 1 user\nLoad average: 0.14, 0.08, 0.05\nFocus: Microservices & CRDT\nStatus: <span class="highlight">Learning & Coding...</span>`,
        'ls': '<span class="highlight">posts/</span>  <span class="highlight">projects/</span>  <span class="highlight">about.txt</span>  <span class="highlight">resume.pdf</span>\n<i>(Tip: type "cd posts" to view blog)</i>',
        'cd posts': 'Redirecting to Blog Posts...',
        'sudo': 'grayfalcon is not in the sudoers file. This incident will be reported.',
        'exit': 'logout'
    };

    // 1. 同步隐藏输入框的值到可见的 span
    inputField.addEventListener('input', () => {
        cmdText.textContent = inputField.value;
    });

    // 2. 处理按键事件 (回车、上下箭头)
    inputField.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const rawInput = this.value;
            
            // 如果输入不为空，加入历史记录
            if (rawInput.trim() !== "") {
                commandHistory.push(rawInput);
                historyIndex = commandHistory.length;
            }

            // 将刚才敲击的命令回显到屏幕上
            appendOutput(promptString + escapeHTML(rawInput));

            // 处理命令
            processCommand(rawInput);

            // 清空当前行
            this.value = '';
            cmdText.textContent = '';
            scrollToBottom();

        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                this.value = commandHistory[historyIndex];
                cmdText.textContent = this.value;
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                this.value = commandHistory[historyIndex];
                cmdText.textContent = this.value;
            } else {
                historyIndex = commandHistory.length;
                this.value = '';
                cmdText.textContent = '';
            }
        }
    });

    // 3. 执行命令逻辑 (核心枢纽)
    function processCommand(rawInput) {
        const cmd = rawInput.trim().toLowerCase();
        if (cmd === '') return;

        // --- 核心控制流 ---
        if (cmd === 'clear') {
            outputBox.innerHTML = '';
        } else if (cmd === 'exit') {
            appendOutput("Connection closed.");
            setTimeout(() => window.history.back(), 800);
        } else if (cmd === 'cd posts') {
            appendOutput(commands['cd posts']);
            setTimeout(() => window.location.href = '/posts/', 800);
            
        // --- 彩蛋：Neofetch ---
        } else if (cmd === 'neofetch') {
            const asciiLogo = `
<span class="highlight">       /\\_\\ </span>
<span class="highlight">      / / /_  </span>   <span class="prompt">grayfalcon</span>@<span class="prompt">jamaisvu</span>
<span class="highlight">     / /_\\__ \\ </span>  -------------------
<span class="highlight">    / / //_/ / </span>  <span class="highlight">OS:</span> Jamaisvu OS Linux x86_64
<span class="highlight">   / / /_\\ \\/  </span>  <span class="highlight">Kernel:</span> 6.8.0-loom-core
<span class="highlight">  / / /__ \\ \\  </span>  <span class="highlight">Uptime:</span> 1095 days (3 years in CS)
<span class="highlight"> /_/ /____\\_ \\ </span>  <span class="highlight">Packages:</span> 404 (dpkg)
<span class="highlight"> \\_\\/      \\_\\ </span>  <span class="highlight">Shell:</span> bash 5.1.16
                 <span class="highlight">Theme:</span> Matrix Dark
                 <span class="highlight">Terminal:</span> WebTTY
            `.replace(/\n/g, '<br>');
            appendOutput('<div style="white-space: pre; font-family: monospace;">' + asciiLogo + '</div>');

        // --- 彩蛋：Ping ---
        } else if (cmd.startsWith('ping ')) {
            const target = rawInput.split(' ')[1] || 'localhost';
            const lines = [
                `PING ${escapeHTML(target)} (192.168.1.1): 56 data bytes`,
                `64 bytes from 192.168.1.1: icmp_seq=0 ttl=116 time=12.4 ms`,
                `64 bytes from 192.168.1.1: icmp_seq=1 ttl=116 time=15.2 ms`,
                `64 bytes from 192.168.1.1: icmp_seq=2 ttl=116 time=11.8 ms`,
                `64 bytes from 192.168.1.1: icmp_seq=3 ttl=116 time=13.1 ms`,
                `--- ${escapeHTML(target)} ping statistics ---`,
                `4 packets transmitted, 4 packets received, 0.0% packet loss`
            ];
            printLinesAsync(lines, 400);

        // --- 彩蛋：删库跑路 ---
        } else if (cmd === 'sudo rm -rf /' || cmd === 'rm -rf /') {
            const lines = [
                "<span class='warning'>[WARNING] Initializing root file system deletion...</span>",
                "Deleting /boot...",
                "Deleting /etc...",
                "Deleting /home/grayfalcon...",
                "<span class='error'>[FATAL ERROR]</span> Permission denied.",
                "Nice try, hacker. This incident has been logged and reported to the cyber police. 🚓"
            ];
            printLinesAsync(lines, 600);

        // --- 彩蛋：418 咖啡壶协议 ---
        } else if (cmd === 'make coffee' || cmd === 'brew') {
            appendOutput("Resolving coffee machine IP...");
            setTimeout(() => {
                appendOutput("<span class='error'>HTTP/1.1 418 I'm a teapot</span>");
                appendOutput("Error: Server refuses to brew coffee because it is, permanently, a teapot.");
                scrollToBottom();
            }, 800);

        // --- 实用工具：日期与用户 ---
        } else if (cmd === 'date') {
            appendOutput(new Date().toString());
        } else if (cmd === 'who') {
            const today = new Date().toISOString().split('T')[0];
            appendOutput(`grayfalcon   tty1         ${today} 00:00`);
            appendOutput(`guest        pts/0        ${today} (via web)`);

        // --- 彩蛋：黑客潜入 ---
        } else if (cmd === 'hack') {
            const lines = [
                "Bypassing mainframe firewall...",
                "Decrypting RSA-2048 keys... [||||||||||||||||||||] 100%",
                "Injecting payload into <span class='highlight'>kernel_task</span>...",
                "Accessing secret databases...",
                "<span class='prompt'>Access Granted.</span> Welcome to the Matrix."
            ];
            printLinesAsync(lines, 500);

        // --- 基础命令匹配 ---
        } else if (commands[cmd]) {
            appendOutput(commands[cmd].replace(/\n/g, '<br>'));
            
        // --- 拦截无效的 CD 命令 ---
        } else if (cmd.startsWith('cd ')) {
            appendOutput(`bash: cd: ${escapeHTML(rawInput.substring(3))}: No such file or directory`);

        // --- 未知命令兜底 ---
        } else {
            appendOutput(`<span class="error">bash: ${escapeHTML(cmd)}: command not found</span>`);
        }
    }

    // 4. 追加输出到历史容器
    function appendOutput(htmlContent) {
        const div = document.createElement('div');
        div.className = 'line';
        div.innerHTML = htmlContent;
        outputBox.appendChild(div);
    }

    // 5. 异步逐行输出（模拟程序执行耗时）
    function printLinesAsync(lines, delay, callback) {
        let i = 0;
        inputField.disabled = true; // 执行期间禁用输入
        
        function printNext() {
            if (i < lines.length) {
                appendOutput(lines[i]);
                scrollToBottom();
                i++;
                // 加入随机抖动，让延迟显得更真实 (delay ± 50%)
                const jitter = delay * 0.5 + Math.random() * delay;
                setTimeout(printNext, jitter);
            } else {
                inputField.disabled = false;
                inputField.focus();
                if (callback) callback();
            }
        }
        printNext();
    }

    // 6. 自动滚动到底部
    function scrollToBottom() {
        terminal.scrollTop = terminal.scrollHeight;
    }

    // 7. 安全转义（防止访客输入 XSS 脚本）
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});