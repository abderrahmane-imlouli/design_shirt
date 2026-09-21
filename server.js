const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3000;

const designsFolder =
    path.join(__dirname, "designs");


/* =========================
   CREATE DESIGNS FOLDER
========================= */

if (!fs.existsSync(designsFolder)) {

    fs.mkdirSync(
        designsFolder,
        { recursive: true }
    );

}


/* =========================
   MIDDLEWARE
========================= */

app.use(
    express.json({
        limit: "15mb"
    })
);


app.use(
    express.static(__dirname)
);


/* =========================
   SAVE DESIGN
========================= */

app.post(
    "/save-design",
    (req, res) => {

        try {

            if (!req.body.design) {

                return res.status(400).json({
                    message:
                        "No design data received."
                });

            }


            const base64Data =
                req.body.design.replace(
                    /^data:image\/\w+;base64,/,
                    ""
                );


            const buffer =
                Buffer.from(
                    base64Data,
                    "base64"
                );


            const filename =
                `design-${Date.now()}.png`;


            const filePath =
                path.join(
                    designsFolder,
                    filename
                );


            fs.writeFile(
                filePath,
                buffer,
                error => {

                    if (error) {

                        console.error(error);

                        return res
                            .status(500)
                            .json({
                                message:
                                    "Failed to save design."
                            });

                    }


                    res.status(200).json({

                        message:
                            "Design saved successfully.",

                        filename

                    });

                }
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({

                message:
                    "Server error."

            });

        }

    }
);


/* =========================
   START SERVER
========================= */

app.listen(
    PORT,
    () => {

        console.log(
            `Design Your Shirt is running at http://localhost:${PORT}`
        );

    }
);
