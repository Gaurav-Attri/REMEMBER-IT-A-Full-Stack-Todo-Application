const zod = require('zod');

const nameSchema = zod.string()
                      .trim()
                      .min(2, {message: "Name must be at least 2 characters long"})
                      .max(30, {message: "Name cannot be more than 30 characters long"})
                      .regex(/^[a-z]+$/i, {message: "Name cannot contain invalid characters"})

const emailSchema = zod.string().trim().email({message: "Please enter a valid email"});

const passwordSchema = zod.string().min(6, {message: "Password must be 6 or more characters long"})
                                    .regex(/[A-Z]/, {message: "Password must contain at least one uppercase letter"})
                                    .regex(/[a-z]/, {message: "Password must contain at least one lowercase letter"})
                                    .regex(/\d/, {message: "Password must contain at least one digit"})
                                    .regex(/[\W_]/, {message: "Password must contain at least one special character"})

const signupSchema = zod.object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    password: passwordSchema
});

const singinSchema = zod.object({
    email: emailSchema,
    password: passwordSchema
});

function validateSignupInputs(req, res, next){
    const signupValidate = signupSchema.safeParse(req.body)
    if(!signupValidate.success){
        return res.status(400).json({
            errors: Object.values(signupValidate.error.format())
                    .flatMap(err => err._errors)
                    .filter(Boolean)
        });
    }
    else{
        next();
    }
}

function validateSigninInputs(req, res, next){
    const signinValidate = singinSchema.safeParse(req.body);

    if(!signinValidate){
        return res.status(400).json({
            error: signinValidate.error.format()
        });
    }
    else{
        next();
    }
}

module.exports = {
    validateSignupInputs,
    validateSigninInputs
}