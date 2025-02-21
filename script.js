const searchInput = document.getElementById('search-input');
const dropdown = document.getElementById('dropdown');
const tableContainer = document.getElementById('table-container');
const tableBody = document.querySelector('#table tbody');

// Update the ETF data object with more providers and complete information
const etfData = {
    'Vanguard': [
        { 
            name: 'VTI',
            'Investment Focus': 'Total Stock Market',
            'ETF Category': 'Index',
            'Investment Sector': 'Technology Heavy',
            isRecommended: true,
            expense: 0.03,
            diversificationScore: 95,
            riskLevel: 'Moderate'
        },
        { 
            name: 'VOO',
            'Investment Focus': 'S&P 500',
            'ETF Category': 'Index',
            'Investment Sector': 'Technology Heavy',
            isRecommended: true,
            expense: 0.03,
            diversificationScore: 85,
            riskLevel: 'Moderate'
        },
        { 
            name: 'VUG',
            'Investment Focus': 'Growth',
            'ETF Category': 'Index',
            'Investment Sector': 'Technology Heavy',
            isRecommended: false,
            expense: 0.04,
            diversificationScore: 75,
            riskLevel: 'Moderate-High'
        },
        { 
            name: 'VYM',
            'Investment Focus': 'High Dividend Yield',
            'ETF Category': 'Dividend',
            'Investment Sector': 'Utilities Heavy',
            isRecommended: true,
            expense: 0.06,
            diversificationScore: 80,
            riskLevel: 'Low'
        },
        { 
            name: 'VB',
            'Investment Focus': 'Small-Cap',
            'ETF Category': 'Index',
            'Investment Sector': 'Small-Cap',
            isRecommended: false,
            expense: 0.05,
            diversificationScore: 70,
            riskLevel: 'High'
        }
    ],
    'BlackRock': [
        { 
            name: 'IVV',
            'Investment Focus': 'S&P 500',
            'ETF Category': 'Index',
            'Investment Sector': 'Technology Heavy',
            isRecommended: true,
            expense: 0.03,
            diversificationScore: 85,
            riskLevel: 'Moderate'
        },
        { 
            name: 'AGG',
            'Investment Focus': 'US Aggregate Bond',
            'ETF Category': 'Bond',
            'Investment Sector': 'Fixed Income',
            isRecommended: true,
            expense: 0.04,
            diversificationScore: 90,
            riskLevel: 'Low'
        },
        { 
            name: 'IEMG',
            'Investment Focus': 'Emerging Markets',
            'ETF Category': 'International',
            'Investment Sector': 'Emerging Markets',
            isRecommended: false,
            expense: 0.09,
            diversificationScore: 85,
            riskLevel: 'High'
        }
    ],
    'Fidelity': [
        { 
            name: 'FXAIX',
            'Investment Focus': 'S&P 500',
            'ETF Category': 'Index',
            'Investment Sector': 'Technology Heavy',
            isRecommended: true,
            expense: 0.015,
            diversificationScore: 85,
            riskLevel: 'Moderate'
        },
        { 
            name: 'FTEC',
            'Investment Focus': 'Technology Sector',
            'ETF Category': 'Sector',
            'Investment Sector': 'Technology',
            isRecommended: false,
            expense: 0.084,
            diversificationScore: 60,
            riskLevel: 'High'
        },
        { 
            name: 'FDIS',
            'Investment Focus': 'Consumer Discretionary',
            'ETF Category': 'Sector',
            'Investment Sector': 'Consumer',
            isRecommended: false,
            expense: 0.084,
            diversificationScore: 70,
            riskLevel: 'Moderate-High'
        }
    ],
    'Charles Schwab': [
        { 
            name: 'SCHB',
            'Investment Focus': 'Broad US Market',
            'ETF Category': 'Index',
            'Investment Sector': 'Technology Heavy',
            isRecommended: true,
            expense: 0.03,
            diversificationScore: 90,
            riskLevel: 'Moderate'
        },
        { 
            name: 'SCHD',
            'Investment Focus': 'US Dividend Equity',
            'ETF Category': 'Dividend',
            'Investment Sector': 'Utilities Heavy',
            isRecommended: true,
            expense: 0.06,
            diversificationScore: 80,
            riskLevel: 'Low'
        },
        { 
            name: 'SCHF',
            'Investment Focus': 'International Developed Markets',
            'ETF Category': 'International',
            'Investment Sector': 'International',
            isRecommended: false,
            expense: 0.06,
            diversificationScore: 85,
            riskLevel: 'Moderate-High'
        }
    ],
    'State Street': [
        { 
            name: 'SPY',
            name: 'SPY',
            'Investment Focus': 'S&P 500',
            'ETF Category': 'Index',
            'Investment Sector': 'Technology Heavy',
            isRecommended: true,
            expense: 0.0945,
            diversificationScore: 85,
            riskLevel: 'Moderate'
        },
        { 
            name: 'XLK',
            'Investment Focus': 'Technology Sector',
            'ETF Category': 'Sector',
            'Investment Sector': 'Technology',
            isRecommended: false,
            expense: 0.10,
            diversificationScore: 60,
            riskLevel: 'High'
        },
        { 
            name: 'XLU',
            'Investment Focus': 'Utilities Sector',
            'ETF Category': 'Sector',
            'Investment Sector': 'Utilities',
            isRecommended: false,
            expense: 0.10,
            diversificationScore: 65,
            riskLevel: 'Low'
        }
    ]
};

// Track user's portfolio
let userPortfolio = [];

// Add at the top with other variables
let userPreferences = null;
let performanceChart = null;

// Add these variables at the top with other declarations
let sectorChart = null;
let categoryChart = null;
let riskChart = null;

// Populate dropdown with ETF providers
function populateDropdown() {
    dropdown.innerHTML = '';
    Object.keys(etfData).forEach(provider => {
        const div = document.createElement('div');
        div.textContent = provider;
        dropdown.appendChild(div);
    });
}

// Add this function to determine ETF recommendations based on user preferences
function getRecommendedEtfs(preferences) {
    const recommendations = [];
    
    Object.values(etfData).forEach(provider => {
        provider.forEach(etf => {
            let score = 0;
            
            // Risk tolerance matching
            if (preferences.riskTolerance === 'conservative' && etf.riskLevel === 'Low') score += 3;
            if (preferences.riskTolerance === 'moderate' && etf.riskLevel === 'Moderate') score += 3;
            if (preferences.riskTolerance === 'aggressive' && 
                (etf.riskLevel === 'High' || etf.riskLevel === 'Moderate-High')) score += 3;
            
            // Investment timeline consideration
            if (preferences.investmentTimeline === 'short' && etf['ETF Category'] === 'Bond') score += 2;
            if (preferences.investmentTimeline === 'long' && etf['ETF Category'] === 'Index') score += 2;
            
            // Investment goal alignment
            if (preferences.investmentGoal === 'income' && etf['ETF Category'] === 'Dividend') score += 2;
            if (preferences.investmentGoal === 'growth' && 
                (etf['Investment Focus'].includes('Growth') || etf['Investment Focus'].includes('Total Stock Market'))) score += 2;
            
            // Experience level consideration
            if (preferences.experience === 'beginner' && etf.diversificationScore >= 80) score += 1;
            if (preferences.experience === 'advanced' && etf['ETF Category'] === 'Sector') score += 1;

            if (score >= 3) {
                recommendations.push(etf.name);
            }
        });
    });
    
    return recommendations;
}

// Update the displayTable function to use the new recommendation system
function displayTable(provider) {
    tableBody.innerHTML = '';
    const etfs = etfData[provider];
    const recommendedEtfs = userPreferences ? getRecommendedEtfs(userPreferences) : [];
    
    if (etfs) {
        etfs.forEach(etf => {
            const row = document.createElement('tr');
            const isRecommended = recommendedEtfs.includes(etf.name);
            const recommendationStar = isRecommended ? '⭐' : '';
            
            const expense = typeof etf.expense !== 'undefined' ? etf.expense : 'N/A';
            const riskLevel = etf.riskLevel || 'Not Specified';
            
            row.innerHTML = `
                <td>
                    ${etf.name} ${recommendationStar}
                    <button class="add-to-portfolio" data-etf="${etf.name}" data-provider="${provider}">
                        Add to Portfolio
                    </button>
                </td>
                <td>${etf['Investment Focus'] || 'N/A'}</td>
                <td>${etf['ETF Category'] || 'N/A'}</td>
                <td>${etf['Investment Sector'] || 'N/A'}</td>
                <td>${expense === 'N/A' ? 'N/A' : expense.toFixed(3)}%</td>
                <td>${riskLevel}</td>
            `;
            tableBody.appendChild(row);
        });
        tableContainer.style.display = 'block';
    }
}

// Add ETF to portfolio
function addToPortfolio(etfName, provider) {
    const etf = etfData[provider].find(e => e.name === etfName);
    if (etf && !userPortfolio.find(p => p.name === etfName)) {
        userPortfolio.push(etf);
        updatePortfolioDisplay();
        // Refresh recommendations
        displayTable(provider);
    }
}

// Add this function to initialize charts
function initializeCharts() {
    const sectorCtx = document.getElementById('sectorChart').getContext('2d');
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    const riskCtx = document.getElementById('riskChart').getContext('2d');

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: true,
        resizeDelay: 100,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    boxWidth: 15,
                    font: {
                        size: 12
                    }
                }
            }
        }
    };

    // Initialize Sector Chart
    sectorChart = new Chart(sectorCtx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
                ]
            }]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: 'Portfolio Sector Distribution',
                    font: { size: 16, weight: 'bold' },
                    padding: 20
                }
            }
        }
    });

    // Initialize Category Chart
    categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
                ]
            }]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: 'ETF Category Distribution',
                    font: { size: 16, weight: 'bold' },
                    padding: 20
                }
            }
        }
    });

    // Initialize Risk Chart
    riskChart = new Chart(riskCtx, {
        type: 'bar',
        data: {
            labels: ['Low', 'Moderate', 'Moderate-High', 'High'],
            datasets: [{
                label: 'Portfolio Distribution',
                data: [0, 0, 0, 0],
                backgroundColor: '#36A2EB'
            }]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: 'Risk Level Distribution',
                    font: { size: 16, weight: 'bold' },
                    padding: 20
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            const total = this.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            return total > 0 ? ((value / total) * 100).toFixed(0) + '%' : '0%';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Percentage of Portfolio'
                    }
                }
            }
        }
    });
}

// Add this function to update charts
function updateCharts() {
    if (!userPortfolio.length) {
        sectorChart.data.labels = [];
        sectorChart.data.datasets[0].data = [];
        categoryChart.data.labels = [];
        categoryChart.data.datasets[0].data = [];
        riskChart.data.datasets[0].data = [0, 0, 0, 0];
        
        sectorChart.update();
        categoryChart.update();
        riskChart.update();
        return;
    }

    // Update Sector Chart
    const sectorData = {};
    userPortfolio.forEach(etf => {
        const sector = etf['Investment Sector'];
        sectorData[sector] = (sectorData[sector] || 0) + 1;
    });

    sectorChart.data.labels = Object.keys(sectorData);
    sectorChart.data.datasets[0].data = Object.values(sectorData);

    // Update Category Chart
    const categoryData = {};
    userPortfolio.forEach(etf => {
        const category = etf['ETF Category'];
        categoryData[category] = (categoryData[category] || 0) + 1;
    });

    categoryChart.data.labels = Object.keys(categoryData);
    categoryChart.data.datasets[0].data = Object.values(categoryData);

    // Update Risk Chart
    const riskData = {
        'Low': 0,
        'Moderate': 0,
        'Moderate-High': 0,
        'High': 0
    };
    userPortfolio.forEach(etf => {
        riskData[etf.riskLevel]++;
    });

    riskChart.data.datasets[0].data = Object.values(riskData);

    // Update all charts
    sectorChart.update();
    categoryChart.update();
    riskChart.update();
}

// Update the fetchHistoricalData function
async function fetchHistoricalData(symbol, days) {
    try {
        // Show loading state while fetching
        showLoadingState(performanceChart);
        
        const response = await fetch(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
        );
        const data = await response.json();

        // Check for API limit message
        if (data['Note']) {
            console.warn('API call limit reached:', data['Note']);
            return generateFallbackData(symbol, days); // Use fallback data if API limit reached
        }

        const timeSeriesData = data['Time Series (Daily)'];
        if (!timeSeriesData) {
            console.warn('No data received for symbol:', symbol);
            return generateFallbackData(symbol, days);
        }

        // Convert the data to our format
        const formattedData = Object.entries(timeSeriesData)
            .slice(0, days)
            .map(([date, values]) => ({
                date: new Date(date),
                price: parseFloat(values['4. close'])
            }))
            .reverse(); // Reverse to show oldest to newest

        return formattedData;
    } catch (error) {
        console.error('Error fetching data for', symbol, ':', error);
        return generateFallbackData(symbol, days);
    }
}

// Add a fallback function for when API calls are exhausted
function generateFallbackData(symbol, days) {
    const data = [];
    const today = new Date();
    const basePrice = getBasePrice(symbol);
    
    for (let i = days; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Generate semi-realistic price movements
        const randomFactor = 1 + (Math.random() - 0.5) * 0.02;
        const price = basePrice * Math.pow(randomFactor, days - i);
        
        data.push({
            date: date,
            price: price
        });
    }
    
    return data;
}

// Add a simple caching mechanism to avoid hitting API limits
const cache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

async function getCachedData(symbol, days) {
    const cacheKey = `${symbol}_${days}`;
    const cachedItem = cache.get(cacheKey);
    
    if (cachedItem && (Date.now() - cachedItem.timestamp) < CACHE_DURATION) {
        return cachedItem.data;
    }

    const data = await fetchHistoricalData(symbol, days);
    cache.set(cacheKey, {
        data: data,
        timestamp: Date.now()
    });
    
    return data;
}

// Update the calculatePercentageChange function
function calculatePercentageChange(data) {
    if (data.length === 0) return [];
    const basePrice = data[0].price;
    return data.map(point => ({
        x: new Date(point.date),
        y: ((point.price - basePrice) / basePrice) * 100,
        price: point.price
    }));
}

// Update the calculateCombinedPerformance function
function calculateCombinedPerformance(datasets) {
    if (!datasets.length) return [];
    
    // Find the most recent common start date
    const startDates = datasets.map(ds => ds.data[0]?.x.getTime() || Date.now());
    const commonStartDate = Math.max(...startDates);
    
    // Filter data to start from common date
    const filteredDatasets = datasets.map(ds => ({
        ...ds,
        data: ds.data.filter(d => d.x.getTime() >= commonStartDate)
    }));

    // Get all dates after common start date
    const allDates = new Set();
    filteredDatasets.forEach(dataset => {
        dataset.data.forEach(point => {
            allDates.add(point.x.getTime());
        });
    });

    const sortedDates = Array.from(allDates).sort((a, b) => a - b);
    
    // Calculate relative to first day for each ETF
    return sortedDates.map(timestamp => {
        const date = new Date(timestamp);
        const values = filteredDatasets.map(dataset => {
            const point = dataset.data.find(p => p.x.getTime() === timestamp);
            return point ? point.y : null;
        }).filter(v => v !== null);

        if (values.length === 0) return null;

        // Calculate average percentage change
        const avgChange = values.reduce((sum, val) => sum + val, 0) / values.length;

        return {
            x: date,
            y: avgChange
        };
    }).filter(point => point !== null);
}

// Update the updatePerformanceChart function
async function updatePerformanceChart(days) {
    if (!userPortfolio.length) {
        performanceChart.data.datasets = [];
        performanceChart.update();
        return;
    }

    try {
        showLoadingState(performanceChart);

        // Get individual ETF datasets
        const individualDatasets = await Promise.all(userPortfolio.map(async (etf) => {
            const data = await getCachedData(etf.name, days);
            return {
                label: etf.name,
                data: calculatePercentageChange(data)
            };
        }));

        // Calculate combined performance
        const combinedData = calculateCombinedPerformance(individualDatasets);

        // Smooth the data based on timeframe
        const smoothingFactor = days > 365 ? 7 : days > 30 ? 3 : 1;
        const smoothedData = combinedData.filter((_, i) => i % smoothingFactor === 0);

        // Update chart data
        performanceChart.data.datasets = [{
            label: 'Portfolio Performance',
            data: smoothedData,
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6
        }];

        // Calculate reasonable y-axis bounds
        const values = smoothedData.map(d => d.y);
        const maxVal = Math.max(...values);
        const minVal = Math.min(...values);
        const range = maxVal - minVal;
        const padding = range * 0.1;

        // Update y-axis
        performanceChart.options.scales.y = {
            beginAtZero: false,
            min: Math.floor((minVal - padding) / 5) * 5,
            max: Math.ceil((maxVal + padding) / 5) * 5,
            ticks: {
                callback: value => `${value.toFixed(1)}%`
            },
            grid: {
                color: 'rgba(0, 0, 0, 0.1)'
            }
        };

        // Update x-axis time unit
        const timeUnit = days <= 7 ? 'day' : 
                        days <= 30 ? 'week' :
                        days <= 90 ? 'month' :
                        'year';

        performanceChart.options.scales.x.time.unit = timeUnit;

        performanceChart.update();
    } catch (error) {
        console.error('Error updating performance chart:', error);
        performanceChart.data.datasets = [];
    } finally {
        hideLoadingState(performanceChart);
    }
}

// Helper function for random colors
function getRandomColor() {
    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#2196F3', '#4CAF50', '#FF5722', '#9C27B0'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Modify the updatePortfolioDisplay function to include chart updates
function updatePortfolioDisplay() {
    const portfolioContainer = document.getElementById('portfolio-container');
    portfolioContainer.innerHTML = `
        <h3>Your Portfolio (${userPortfolio.length} ETFs)</h3>
        <div class="portfolio-stats">
            <p>Diversity Score: ${calculateDiversityScore()}%</p>
            <p>Average Expense: ${calculateAverageExpense()}%</p>
        </div>
        <div class="portfolio-etfs">
            ${userPortfolio.map(etf => `
                <div class="portfolio-etf">
                    <span>${etf.name}</span>
                    <button class="remove-etf" data-etf="${etf.name}">Remove</button>
                </div>
            `).join('')}
        </div>
        <button class="save-portfolio-btn">Save Portfolio</button>
    `;

    // Add event listener for save portfolio button
    const saveBtn = portfolioContainer.querySelector('.save-portfolio-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveUserPortfolio);
    }

    // Update the charts
    updateCharts();
    updatePerformanceChart(7); // Default to 7 days when portfolio changes
}

// Calculate portfolio diversity score
function calculateDiversityScore() {
    if (userPortfolio.length === 0) return 0;
    
    const uniqueSectors = new Set(userPortfolio.map(etf => etf['Investment Sector']));
    const uniqueCategories = new Set(userPortfolio.map(etf => etf['ETF Category']));
    
    return Math.round(((uniqueSectors.size + uniqueCategories.size) / 
        (userPortfolio.length * 2)) * 100);
}

// Calculate average expense ratio
function calculateAverageExpense() {
    if (userPortfolio.length === 0) return 0;
    const total = userPortfolio.reduce((sum, etf) => sum + etf.expense, 0);
    return (total / userPortfolio.length).toFixed(2);
}

// Event Listeners
searchInput.addEventListener('focus', () => {
    populateDropdown();
    dropdown.style.display = 'block';
});

searchInput.addEventListener('blur', () => {
    setTimeout(() => {
        dropdown.style.display = 'none';
    }, 200);
});

dropdown.addEventListener('click', (event) => {
    if (event.target.tagName === 'DIV') {
        const selectedProvider = event.target.textContent;
        searchInput.value = selectedProvider;
        dropdown.style.display = 'none';
        displayTable(selectedProvider);
    }
});

// Add event listeners for portfolio management
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-portfolio')) {
        const etfName = event.target.dataset.etf;
        const provider = event.target.dataset.provider;
        addToPortfolio(etfName, provider);
    }
    
    if (event.target.classList.contains('remove-etf')) {
        const etfName = event.target.dataset.etf;
        userPortfolio = userPortfolio.filter(etf => etf.name !== etfName);
        updatePortfolioDisplay();
        // Refresh recommendations if table is visible
        const currentProvider = searchInput.value;
        if (currentProvider in etfData) {
            displayTable(currentProvider);
        }
    }
});

// Update the form submission handler
document.getElementById('investment-profile').addEventListener('submit', (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    userPreferences = {
        riskTolerance: formData.get('riskTolerance'),
        investmentTimeline: formData.get('investmentTimeline'),
        investmentGoal: formData.get('investmentGoal'),
        experience: formData.get('experience')
    };
    
    // Scroll to the search section
    document.querySelector('.search-box').scrollIntoView({ behavior: 'smooth' });
    
    // Focus the search input and show dropdown
    setTimeout(() => {
        searchInput.focus();
        dropdown.style.display = 'block';
        
        // Add a temporary guidance message
        const guidanceMsg = document.createElement('div');
        guidanceMsg.className = 'guidance-message';
        guidanceMsg.textContent = 'Select an ETF provider to view recommended ETFs ↓';
        searchInput.parentElement.insertBefore(guidanceMsg, dropdown);
        
        // Remove the guidance message after 5 seconds
        setTimeout(() => {
            guidanceMsg.remove();
        }, 5000);
    }, 500);
});

// Add this after the form submission handler
document.querySelector('.save-preferences-btn').addEventListener('click', () => {
    const form = document.getElementById('investment-profile');
    const formData = new FormData(form);
    
    const preferences = {
        riskTolerance: formData.get('riskTolerance'),
        investmentTimeline: formData.get('investmentTimeline'),
        investmentGoal: formData.get('investmentGoal'),
        experience: formData.get('experience')
    };

    // Validate that all fields are filled
    if (Object.values(preferences).some(value => !value)) {
        alert('Please fill out all fields before saving preferences');
        return;
    }

    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    if (!currentUser) {
        alert('Please log in to save preferences');
        return;
    }

    // Save preferences with user-specific key
    localStorage.setItem(`investment_preferences_${currentUser.email}`, JSON.stringify(preferences));
    alert('Investment preferences saved successfully!');
});

// Function to save user portfolio
function saveUserPortfolio() {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    if (!currentUser) {
        alert('Please log in to save portfolio');
        return;
    }

    localStorage.setItem(`user_portfolio_${currentUser.email}`, JSON.stringify(userPortfolio));
    alert('Portfolio saved successfully!');
}

// Initialize dropdown
populateDropdown();

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    initializePerformanceChart();
    
    // Load saved preferences if they exist
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    if (currentUser) {
        const savedPreferences = JSON.parse(localStorage.getItem(`investment_preferences_${currentUser.email}`) || '{}');
        if (Object.keys(savedPreferences).length > 0) {
            // Fill the form with saved preferences
            const form = document.getElementById('investment-profile');
            form.elements['riskTolerance'].value = savedPreferences.riskTolerance;
            form.elements['investmentTimeline'].value = savedPreferences.investmentTimeline;
            form.elements['investmentGoal'].value = savedPreferences.investmentGoal;
            form.elements['experience'].value = savedPreferences.experience;
        }

        // Load saved portfolio
        const savedPortfolio = JSON.parse(localStorage.getItem(`user_portfolio_${currentUser.email}`) || '[]');
        if (savedPortfolio.length > 0) {
            userPortfolio = savedPortfolio;
            updatePortfolioDisplay();
        }
    }
});

// Add to your existing code
function showLoadingState(chart) {
    chart.options.plugins.title.text = 'Loading data...';
    chart.update();
}

function hideLoadingState(chart) {
    chart.options.plugins.title.text = 'Portfolio Performance';
    chart.update();
}

// Helper function to get base price for ETFs
function getBasePrice(symbol) {
    const basePrices = {
        'VTI': 220,
        'VOO': 400,
        'VUG': 300,
        'IVV': 400,
        'AGG': 108,
        'SCHB': 52,
        'SPY': 420,
        // Add more ETFs as needed
    };
    return basePrices[symbol] || 100;
}

// Update the initializePerformanceChart function
async function initializePerformanceChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    // Create timeframe buttons with longer periods
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'timeframe-buttons';
    buttonContainer.innerHTML = `
        <button class="timeframe-btn active" data-days="7">1W</button>
        <button class="timeframe-btn" data-days="30">1M</button>
        <button class="timeframe-btn" data-days="90">3M</button>
        <button class="timeframe-btn" data-days="180">6M</button>
        <button class="timeframe-btn" data-days="365">1Y</button>
        <button class="timeframe-btn" data-days="1825">5Y</button>
        <button class="timeframe-btn" data-days="3650">10Y</button>
    `;
    ctx.canvas.parentNode.insertBefore(buttonContainer, ctx.canvas);

    // Create and append tooltip element
    let tooltipEl = document.querySelector('.price-tooltip');
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.className = 'price-tooltip';
        document.body.appendChild(tooltipEl);
    }

    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            plugins: {
                tooltip: {
                    enabled: false,
                    external: function(context) {
                        const {chart, tooltip} = context;
                        const tooltipEl = document.querySelector('.price-tooltip');

                        // Hide tooltip if no active tooltip
                        if (tooltip.opacity === 0) {
                            tooltipEl.style.opacity = 0;
                            return;
                        }

                        // Create tooltip content
                        if (tooltip.body) {
                            const date = new Date(tooltip.title[0]);
                            const formattedDate = date.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });

                            // Sort ETFs by percentage change
                            const etfData = tooltip.dataPoints.map(point => ({
                                label: point.dataset.label,
                                percentage: point.raw.y,
                                price: point.raw.price,
                                color: point.dataset.borderColor
                            })).sort((a, b) => b.percentage - a.percentage);

                            let innerHtml = `
                                <div class="tooltip-header">${formattedDate}</div>
                                <div class="tooltip-body">
                                    <table>
                            `;

                            etfData.forEach(etf => {
                                innerHtml += `
                                    <tr>
                                        <td class="tooltip-label">
                                            <span class="color-dot" style="background:${etf.color}"></span>
                                            ${etf.label}:
                                        </td>
                                        <td class="tooltip-value">
                                            $${etf.price.toFixed(2)}
                                            <span class="percentage-change ${etf.percentage >= 0 ? 'positive' : 'negative'}">
                                                ${etf.percentage >= 0 ? '+' : ''}${etf.percentage.toFixed(2)}%
                                            </span>
                                        </td>
                                    </tr>
                                `;
                            });
                            innerHtml += '</table></div>';
                            tooltipEl.innerHTML = innerHtml;
                        }

                        // Position tooltip
                        const position = chart.canvas.getBoundingClientRect();
                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.position = 'fixed';
                        tooltipEl.style.left = position.left + window.pageXOffset + tooltip.caretX + 'px';
                        tooltipEl.style.top = position.top + window.pageYOffset + tooltip.caretY - 10 + 'px';
                        tooltipEl.style.transform = 'translate(-50%, -100%)';
                    }
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: 'Portfolio Performance',
                    font: { size: 16 }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'MMM d',
                            week: 'MMM d',
                            month: 'MMM yyyy',
                            year: 'yyyy'
                        },
                        tooltipFormat: 'MMM d, yyyy'
                    },
                    display: true,
                    grid: {
                        display: true
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 0
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    display: true,
                    grid: {
                        display: true
                    },
                    title: {
                        display: true,
                        text: 'Percentage Change (%)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1) + '%';
                        }
                    }
                }
            },
            elements: {
                point: {
                    radius: 2,
                    hoverRadius: 4
                },
                line: {
                    tension: 0.1
                }
            }
        }
    });

    // Add event listeners to timeframe buttons
    buttonContainer.querySelectorAll('.timeframe-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const days = parseInt(e.target.dataset.days);
            buttonContainer.querySelectorAll('.timeframe-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            await updatePerformanceChart(days);
        });
    });

    await updatePerformanceChart(7);
}

// Add window resize handler
window.addEventListener('resize', () => {
    if (performanceChart) {
        performanceChart.resize();
    }
    if (sectorChart) {
        sectorChart.resize();
    }
    if (categoryChart) {
        categoryChart.resize();
    }
    if (riskChart) {
        riskChart.resize();
    }
});

// Add these utility functions
function calculatePortfolioMetrics() {
    if (!userPortfolio.length) return null;
    
    return {
        totalValue: calculateTotalValue(),
        riskScore: calculateRiskScore(),
        diversificationMetrics: calculateDiversificationMetrics(),
        sectorExposure: calculateSectorExposure(),
        expenseMetrics: calculateExpenseMetrics()
    };
}

function calculateTotalValue() {
    return userPortfolio.reduce((total, etf) => {
        const lastPrice = cache.get(`${etf.name}_7`)?.data.slice(-1)[0]?.price || 0;
        return total + lastPrice;
    }, 0);
}

function calculateRiskScore() {
    const riskWeights = {
        'Low': 1,
        'Moderate': 2,
        'Moderate-High': 3,
        'High': 4
    };
    
    return userPortfolio.reduce((score, etf) => {
        return score + riskWeights[etf.riskLevel];
    }, 0) / userPortfolio.length;
}

function calculateDiversificationMetrics() {
    const sectors = new Set(userPortfolio.map(etf => etf['Investment Sector']));
    const categories = new Set(userPortfolio.map(etf => etf['ETF Category']));
    
    return {
        sectorCount: sectors.size,
        categoryCount: categories.size,
        diversificationScore: calculateDiversityScore(),
        overallDiversification: (sectors.size + categories.size) / (6 + 4) * 100 // Normalized to 100
    };
}

function calculateSectorExposure() {
    const sectorExposure = {};
    userPortfolio.forEach(etf => {
        const sector = etf['Investment Sector'];
        sectorExposure[sector] = (sectorExposure[sector] || 0) + 1;
    });
    
    return Object.entries(sectorExposure).map(([sector, count]) => ({
        sector,
        percentage: (count / userPortfolio.length) * 100
    }));
}

function calculateExpenseMetrics() {
    const expenses = userPortfolio.map(etf => etf.expense);
    return {
        averageExpense: calculateAverageExpense(),
        lowestExpense: Math.min(...expenses),
        highestExpense: Math.max(...expenses),
        totalExpense: expenses.reduce((a, b) => a + b, 0)
    };
}

// Add this to improve ETF recommendations
function getEnhancedRecommendations(preferences, currentPortfolio) {
    const recommendations = {
        highlyRecommended: [],
        recommended: [],
        considerAdding: []
    };
    
    // Calculate current portfolio characteristics
    const currentSectors = new Set(currentPortfolio.map(etf => etf['Investment Sector']));
    const currentCategories = new Set(currentPortfolio.map(etf => etf['ETF Category']));
    
    Object.values(etfData).forEach(provider => {
        provider.forEach(etf => {
            let score = calculateRecommendationScore(etf, preferences, currentPortfolio);
            
            // Add diversification bonus
            if (!currentSectors.has(etf['Investment Sector'])) score += 2;
            if (!currentCategories.has(etf['ETF Category'])) score += 2;
            
            // Categorize based on score
            if (score >= 8) {
                recommendations.highlyRecommended.push({...etf, score});
            } else if (score >= 6) {
                recommendations.recommended.push({...etf, score});
            } else if (score >= 4) {
                recommendations.considerAdding.push({...etf, score});
            }
        });
    });
    
    return recommendations;
}

function calculateRecommendationScore(etf, preferences, currentPortfolio) {
    let score = 0;
    
    // Risk alignment
    score += calculateRiskAlignmentScore(etf, preferences.riskTolerance);
    
    // Investment timeline alignment
    score += calculateTimelineScore(etf, preferences.investmentTimeline);
    
    // Goal alignment
    score += calculateGoalAlignmentScore(etf, preferences.investmentGoal);
    
    // Experience level consideration
    score += calculateExperienceScore(etf, preferences.experience);
    
    // Expense ratio consideration
    score += calculateExpenseScore(etf);
    
    // Portfolio fit
    score += calculatePortfolioFitScore(etf, currentPortfolio);
    
    return score;
}

function getPortfolioOptimizationSuggestions() {
    if (!userPortfolio.length) return [];
    
    const suggestions = [];
    const metrics = calculatePortfolioMetrics();
    
    // Check sector concentration
    const sectorExposure = metrics.sectorExposure;
    const highConcentrationSectors = sectorExposure.filter(s => s.percentage > 30);
    if (highConcentrationSectors.length) {
        suggestions.push({
            type: 'warning',
            title: 'High Sector Concentration',
            description: `Your portfolio has high exposure to ${highConcentrationSectors[0].sector} (${highConcentrationSectors[0].percentage.toFixed(1)}%). Consider diversifying.`,
            action: 'diversify'
        });
    }
    
    // Check expense ratios
    if (metrics.expenseMetrics.averageExpense > 0.20) {
        suggestions.push({
            type: 'optimization',
            title: 'High Expense Ratio',
            description: 'Consider lower-cost alternatives to reduce fees.',
            action: 'reduce_costs'
        });
    }
    
    // Add more sophisticated suggestions based on other metrics...
    
    return suggestions;
} 