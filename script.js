// DOM Elements
const form = document.querySelector('form');
const ipInput = document.getElementById('ip-input');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close-btn');
const errorMessage = document.getElementById('error-message');

// Info Elements
const ipInfo = document.getElementById('ip-info');
const locationInfo = document.getElementById('location-info');
const timezoneInfo = document.getElementById('timezone-info');
const ispInfo = document.getElementById('isp-info');

// Initialize map
let map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 13,
    zoomControl: false
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker;

// IP Geolocation API endpoint
const API_KEY = 'at_G4qG0DDNSnDUXbbHwjawKR85RyahV'; // Replace with your actual API key
const API_ENDPOINT = 'https://geo.ipify.org/api/v2/country,city,vpn';

// Function to validate IP address
function isValidIP(ip) {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipRegex.test(ip);
}

// Function to validate domain
function isValidDomain(domain) {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
}

// Function to show error modal
function showError(message) {
    errorMessage.textContent = message;
    modal.showModal();
}

// Function to update UI with IP data
function updateUI(data) {
    ipInfo.textContent = data.ip;
    locationInfo.textContent = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`;
    timezoneInfo.textContent = `UTC ${data.location.timezone}`;
    ispInfo.textContent = data.isp;

    // Update map
    const lat = data.location.lat;
    const lng = data.location.lng;
    
    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([lat, lng]).addTo(map);
    map.setView([lat, lng], 13);
}

// Function to fetch IP data
async function fetchIPData(searchTerm) {
    try {
        const params = new URLSearchParams({
            apiKey: API_KEY,
        });

        if (isValidIP(searchTerm)) {
            params.append('ipAddress', searchTerm);
        } else if (isValidDomain(searchTerm)) {
            params.append('domain', searchTerm);
        } else {
            throw new Error('Please enter a valid IP address or domain');
        }

        const response = await fetch(`${API_ENDPOINT}?${params}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch IP data. Please try again.');
        }

        const data = await response.json();
        updateUI(data);
    } catch (error) {
        showError(error.message);
    }
}

// Event Listeners
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = ipInput.value.trim();
    if (searchTerm) {
        fetchIPData(searchTerm);
    }
});

closeBtn.addEventListener('click', () => {
    modal.close();
});

// Get initial IP data on page load
window.addEventListener('load', () => {
    fetchIPData('');
});