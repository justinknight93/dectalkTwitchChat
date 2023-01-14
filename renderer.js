const information = document.getElementById('info');

setInterval(() => {
    const logs = getLogs();

    information.innerHTML = logs.map(log => 
        `<div style="color:${log.color}">
          ${log.message}
        </div>`
    ).join('')
}, 100);
