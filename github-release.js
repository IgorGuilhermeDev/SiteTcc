const GITHUB_REPO = 'IgorGuilhermeDev/ReleasesScriptHero';

function isLTSVersion(tagName) {
    const version = tagName.replace(/^v/, '');
    return /^\d+\.0\.0$/.test(version);
}

async function updateDownloadButton() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`GitHub API error: ${data.message}`);
        }

        const jarAsset = data.assets.find(asset => asset.name.endsWith('.jar'));
        
        if (!jarAsset) {
            throw new Error('No JAR file found in the latest release');
        }

        console.log(data);
    
        const downloadBtn = document.querySelector('.download-btn');
        if (downloadBtn) {
            downloadBtn.href = jarAsset.browser_download_url;
            downloadBtn.download = jarAsset.name;
            
            const osSelect = document.getElementById('os-select');
            const selectedOS = osSelect ? osSelect.value : 'linux';
            downloadBtn.textContent = `⬇️ Baixar ${data.tag_name} para ${getOSName(selectedOS)}`;
            
            const versionSpan = document.querySelector('.version');
            const ltsBadge = document.querySelector('.lts-badge');
            
            if (versionSpan) {
                versionSpan.textContent = data.tag_name;
            }

            if (ltsBadge) {
                const isLTS = isLTSVersion(data.tag_name);
                ltsBadge.textContent = isLTS ? 'LTS' : 'RR';
                ltsBadge.setAttribute('data-type', isLTS ? 'lts' : 'rolling');
            }
            
            const fileInfo = document.querySelector('.file-info');
            if (fileInfo) {
                const size = formatFileSize(jarAsset.size);
                fileInfo.textContent = `Java JAR (${size})`;
            }
        }

        if (data.body) {
            const changelogSection = document.createElement('div');
            changelogSection.className = 'changelog';
            changelogSection.innerHTML = `
                <h4>Novidades desta versão:</h4>
                <div class="changelog-content">
                    ${marked.parse(data.body)}
                </div>
            `;
            
            const downloadCard = document.querySelector('.download-card-main');
            const existingChangelog = downloadCard.querySelector('.changelog');
            
            if (existingChangelog) {
                existingChangelog.remove();
            }
            
            downloadCard.appendChild(changelogSection);
        }

    } catch (error) {
        console.error('Error fetching release:', error);
    }
}

function getOSName(osValue) {
    const osNames = {
        'linux': 'Linux',
        'mac': 'macOS',
        'windows': 'Windows'
    };
    return osNames[osValue] || 'Linux';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

document.getElementById('os-select')?.addEventListener('change', function(e) {
    const downloadBtn = document.querySelector('.download-btn');
    const version = document.querySelector('.version')?.textContent || 'latest';
    if (downloadBtn) {
        downloadBtn.textContent = `⬇️ Baixar ${version} para ${getOSName(e.target.value)}`;
    }
});

document.addEventListener('DOMContentLoaded', updateDownloadButton); 