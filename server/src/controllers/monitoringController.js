const { getWeatherData } = require('../utils/weatherService');

// @desc    Get real-time sensor data (Weather + Mock Machines)
// @route   GET /api/monitoring/sensors
// @access  Private (Mill Operator)
const getSensorData = async (req, res) => {
    // Factory location — Jaipur, Rajasthan (India's wool capital)
    const weatherData = await getWeatherData('Jaipur');

    // Mock machine data (internal sensors)
    const machineData = [
        { id: 'scour-01', name: 'Scouring Line A', status: 'Running', health: 98 },
        { id: 'card-01', name: 'Carding Unit 1', status: 'Running', health: 95 },
        { id: 'card-02', name: 'Carding Unit 2', status: 'Maintenance', health: 40 },
        { id: 'spin-01', name: 'Spinning Frame X', status: 'Running', health: 92 },
    ];

    res.json({
        weather: weatherData,
        machines: machineData,
        timestamp: new Date().toISOString()
    });
};

module.exports = { getSensorData };
