// Links http routes and correct handlers
import Express from "express";
import ImagesController from "../controllers/Images.contoller.js";
import TraitsController from "../controllers/Traits.controller.js";
const router = Express.Router();

//just displays in console which route was called (you can delete if if you want)
router.use("*", (req, res, next) => {
    console.log(
        "\x1b[31m",
        req.protocol + "://" + req.get("host") + req.originalUrl,
        " ",
        req.method
    );
    console.log("\x1b[0m", "");
    next();
});

//Prevents non handled errors
const WrappControllerMethod = (fn) => async(req, res, next) => {
    try {
        fn(req, res, next);
    } catch (error) {
        next(error);
    }
};

router.post("/images/get/", WrappControllerMethod(ImagesController.GetImage));
router.post(
    "/images/getrandom/",
    WrappControllerMethod(ImagesController.GetRandomImage)
);

router.post("/images/", WrappControllerMethod(ImagesController.AddImage));

router.put("/images/", WrappControllerMethod(ImagesController.UndoImageFroze));
router.delete(
    "/images/",
    WrappControllerMethod(ImagesController.FullDeleteImage)
);

router.get("/traits/", WrappControllerMethod(TraitsController.GetTraits));
router.get(
    "/traits/:id/",
    WrappControllerMethod(TraitsController.GetTraitValues)
);

//handles errors in methods
const ErrorHandler = (err, req, res, next) => {
    console.log(err);
    res.json({
        error: err.message || "Error",
    });
};
router.use(ErrorHandler);
export default router;
