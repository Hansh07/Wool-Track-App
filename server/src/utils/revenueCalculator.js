
/**
 * Calculates revenue and fees for a wool batch
 * @param {Object} batch - The WoolBatch document populated with QualityReport
 * @returns {Object} financials object to be saved in the batch
 */
const calculateRevenue = (batch) => {
    // 1. Determine Base Price based on Wool Type (Prices in ₹ per kg)
    const basePrices = {
        // Ultra-premium
        'Vicuña':       55000,
        'Qiviut':       35000,
        // Premium
        'Cashmere':     8000,
        'Alpaca':       3250,
        'Angora':       2750,
        'Camel':        2100,
        'Mohair':       1700,
        'Yak':          1400,
        // Standard
        'Fine Merino':  1500,
        'Merino':       1000,
        'Lambswool':    1000,
        'Shetland':     650,
        'Corriedale':   600,
        // Economy
        'Crossbred':    425,
        'Lincoln':      350,
        'Coarse Wool':  275,
        'Carpet Wool':  165,
        // Default fallback
        'default':      300
    };

    const basePricePerKg = basePrices[batch.woolType] || basePrices['default'];

    // 2. Calculate Quality Bonus/Penalty
    let qualityModifier = 0;

    // We need the quality report to be populated
    if (batch.qualityReport) {
        // Yield Bonus
        if (batch.qualityReport.cleanWoolYield > 70) {
            qualityModifier += basePricePerKg * 0.10; // 10% bonus
        } else if (batch.qualityReport.cleanWoolYield < 50) {
            qualityModifier -= basePricePerKg * 0.10; // 10% penalty
        }

        // Fiber Diameter Bonus (Lower is better generally)
        if (batch.qualityReport.fiberDiameter && batch.qualityReport.fiberDiameter < 19) {
            qualityModifier += basePricePerKg * 0.20; // 20% premium
        }
    }

    const finalPricePerKg = basePricePerKg + qualityModifier;
    const grossRevenue = finalPricePerKg * batch.weight;

    // 3. Calculate Service Fees (in ₹)
    // Inspector: Flat fee per batch
    const inspectionFee = 500;

    // Processing: ₹20 per kg (Mill Operator revenue)
    const processingFee = batch.weight * 20;

    // Platform: 5% of gross
    const platformFee = grossRevenue * 0.05;

    // 4. Net Farmer Earnings
    const netFarmerEarnings = grossRevenue - inspectionFee - processingFee - platformFee;

    return {
        basePricePerKg: parseFloat(basePricePerKg.toFixed(2)),
        qualityBonus: parseFloat(qualityModifier.toFixed(2)),
        grossRevenue: parseFloat(grossRevenue.toFixed(2)),
        serviceFees: {
            inspection: inspectionFee,
            processing: processingFee,
            platform: parseFloat(platformFee.toFixed(2))
        },
        netFarmerEarnings: parseFloat(netFarmerEarnings.toFixed(2))
    };
};

module.exports = { calculateRevenue };
