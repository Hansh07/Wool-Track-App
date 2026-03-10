const mongoose = require('mongoose');

const qualityReportSchema = mongoose.Schema({
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'WoolBatch', required: true },
    inspector: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fiberDiameter: { type: Number },
    tensileStrength: { type: Number },
    colorGrade: { type: String },
    cleanWoolYield: { type: Number },
    grade: { type: String, enum: ['A+', 'A', 'B', 'C', 'D'] },
    qualityScore: { type: Number, min: 0, max: 100 },
    notes: { type: String },
    decision: { type: String, enum: ['Approved', 'Rejected'], required: true },
    inspectionDate: { type: Date, default: Date.now }
}, { timestamps: true });

qualityReportSchema.index({ batch: 1 });
qualityReportSchema.index({ inspector: 1 });
qualityReportSchema.index({ decision: 1 });
qualityReportSchema.index({ inspectionDate: -1 });

qualityReportSchema.pre('save', function (next) {
    let score = 50;
    if (this.fiberDiameter) {
        if (this.fiberDiameter < 17) score += 30;
        else if (this.fiberDiameter < 19) score += 20;
        else if (this.fiberDiameter < 22) score += 10;
        else if (this.fiberDiameter > 30) score -= 10;
    }
    if (this.cleanWoolYield) {
        if (this.cleanWoolYield > 75) score += 20;
        else if (this.cleanWoolYield > 65) score += 10;
        else if (this.cleanWoolYield < 50) score -= 10;
    }
    score = Math.min(100, Math.max(0, score));
    this.qualityScore = score;
    if (score >= 90) this.grade = 'A+';
    else if (score >= 75) this.grade = 'A';
    else if (score >= 60) this.grade = 'B';
    else if (score >= 45) this.grade = 'C';
    else this.grade = 'D';
    next();
});

const QualityReport = mongoose.model('QualityReport', qualityReportSchema);
module.exports = QualityReport;
