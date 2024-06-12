



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

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            res.status(201).json({ data });
           
        } else {
            return next(
                res.status(400).json({
                    message: "Captcha verification failed"
                })
            );

        }

    } catch (error) {
        console.log("error veryfing Recaptcha", error);
        next(res.status(500).json("Error in verifying captcha"));

    }

}
export default verifyCaptcha;








