



async function verifyCaptcha(req, res, next) {


    // 1. Check if the user has passed the captcha
    const { reCaptchaValue } = req.body;

    if (!reCaptchaValue) {
        throw new Error("Captcha is required");
    }
    try {

        const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${reCaptchaValue}`,
            {
                method: "POST",
            }
        );
        const data = await response.json();
        console.log(data);
        if (!data.success) {
            const error = new Error("Captcha verification failed");
            return next(error);
        }
        next();

    } catch (error) {
        next(error);

    }

}
export default verifyCaptcha;










