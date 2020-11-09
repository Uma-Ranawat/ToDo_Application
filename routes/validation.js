// VALIDATION
const Joi = require('joi');

// Sign Up Validation
const signupValidation = data => {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .required(),
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required(),
        confirm_password: Joi.string()
            .min(6)
            .required()
    });
    return schema.validate(data);
};

// Login Validation
const signinValidation = data => {
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    });
    return schema.validate(data);
};

// ToDo Validation
const todoValidation = data => {
    const schema = Joi.object({
        description: Joi.string()
            .min(3)
            .required(),
        due_date: Joi.date()
            .required(),
        reminder_date: Joi.date()
            .required()
    });
    return schema.validate(data);
};

module.exports.signupValidation = signupValidation;
module.exports.signinValidation = signinValidation;
module.exports.todoValidation = todoValidation;

