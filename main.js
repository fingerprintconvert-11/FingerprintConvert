function setupConverter(type) {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileInfo = document.getElementById('file-info');
    const filenameLabel = document.getElementById('filename');
    const convertBtn = document.getElementById('convert-btn');
    const progressContainer = document.getElementById('progress-container');
    const progressFill = document.getElementById('progress-fill');
    const downloadContainer = document.getElementById('download-container');
    const downloadLink = document.getElementById('download-link');
    const targetFormat = document.getElementById('target-format');

    let selectedFile = null;

    // Click to browse
    dropZone.addEventListener('click', () => fileInput.click());

    // Drag and drop events
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        selectedFile = file;
        filenameLabel.textContent = file.name;
        fileInfo.classList.remove('hidden');
        downloadContainer.classList.add('hidden');
        progressContainer.classList.add('hidden');
    }

    convertBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('format', targetFormat.value);

        // UI Reset
        fileInfo.classList.add('hidden');
        progressContainer.classList.remove('hidden');
        progressFill.style.width = '0%';
        
        // Simulated progress (since real XHR progress is for upload, not backend processing)
        let progress = 0;
        const interval = setInterval(() => {
            if (progress < 90) {
                progress += Math.random() * 10;
                progressFill.style.width = `${progress}%`;
            }
        }, 500);

        try {
            const response = await fetch(`/api/convert/${type}`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            clearInterval(interval);

            if (response.ok) {
                progressFill.style.width = '100%';
                setTimeout(() => {
                    progressContainer.classList.add('hidden');
                    downloadContainer.classList.remove('hidden');
                    downloadLink.href = result.downloadUrl;
                }, 500);
            } else {
                alert(result.error || 'Conversion failed');
                progressContainer.classList.add('hidden');
                fileInfo.classList.remove('hidden');
            }
        } catch (err) {
            clearInterval(interval);
            alert('An error occurred during conversion');
            progressContainer.classList.add('hidden');
            fileInfo.classList.remove('hidden');
        }
    });
}
