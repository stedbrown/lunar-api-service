const express = require('express');
const { param, validationResult } = require('express-validator');
const { getLunarData, getLunarPhaseForDate } = require('../utils/lunarCalculations');
const router = express.Router();

/**
 * Middleware per gestire gli errori di validazione
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Errore di validazione',
      errors: errors.array().map(err => ({
        param: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * @route   GET /api/lunar/phase
 * @desc    Get current moon phase
 * @access  Public
 */
router.get('/phase', (req, res) => {
  try {
    const currentPhase = getLunarData();
    res.json({
      status: 'success',
      data: {
        phase: currentPhase.phase,
        illumination: currentPhase.illumination,
        emoji: getLunarEmoji(currentPhase.phase),
        date: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve lunar phase data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/lunar/phase/:date
 * @desc    Get moon phase for specific date (YYYY-MM-DD)
 * @access  Public
 */
router.get(
  '/phase/:date',
  [
    param('date')
      .isString()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('La data deve essere nel formato YYYY-MM-DD')
      .custom(value => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new Error('Data non valida');
        }
        
        // Verifica che la data sia in un intervallo ragionevole (1900-2100)
        const year = date.getFullYear();
        if (year < 1900 || year > 2100) {
          throw new Error('La data deve essere compresa tra il 1900 e il 2100');
        }
        
        return true;
      })
  ],
  handleValidationErrors,
  (req, res) => {
    try {
      const dateParam = req.params.date;
      const date = new Date(dateParam);
      
      const phaseData = getLunarPhaseForDate(date);
      res.json({
        status: 'success',
        data: {
          phase: phaseData.phase,
          illumination: phaseData.illumination,
          emoji: getLunarEmoji(phaseData.phase),
          date: date.toISOString()
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve lunar phase data for the specified date',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   GET /api/lunar/info
 * @desc    Get detailed lunar information
 * @access  Public
 */
router.get('/info', (req, res) => {
  try {
    const lunarData = getLunarData();
    res.json({
      status: 'success',
      data: {
        ...lunarData,
        emoji: getLunarEmoji(lunarData.phase),
        date: new Date().toISOString(),
        nextFullMoon: lunarData.nextFullMoon,
        nextNewMoon: lunarData.nextNewMoon,
        age: lunarData.age,
        distance: lunarData.distance
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve detailed lunar information',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Restituisce l'emoji corrispondente alla fase lunare
 * @param {string} phase - La fase lunare
 * @returns {string} - L'emoji corrispondente
 */
function getLunarEmoji(phase) {
  // Sanitizza l'input
  const normalizedPhase = String(phase || '').toLowerCase();
  
  if (normalizedPhase.includes('new')) return '🌑';
  if (normalizedPhase.includes('waxing crescent')) return '🌒';
  if (normalizedPhase.includes('first quarter')) return '🌓';
  if (normalizedPhase.includes('waxing gibbous')) return '🌔';
  if (normalizedPhase.includes('full')) return '🌕';
  if (normalizedPhase.includes('waning gibbous')) return '🌖';
  if (normalizedPhase.includes('last quarter')) return '🌗';
  if (normalizedPhase.includes('waning crescent')) return '🌘';
  
  return '🌙'; // Default emoji
}

module.exports = router; 