document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("tshirt-canvas");
    const ctx = canvas.getContext("2d");

    const elementsLayer = document.getElementById("elements-layer");

    const textInput = document.getElementById("text");
    const fontSizeInput = document.getElementById("font-size");
    const textColorInput = document.getElementById("text-color");

    const addTextButton = document.getElementById("add-text");
    const imageUpload = document.getElementById("image-upload");

    const downloadButton = document.getElementById("download-design");
    const saveButton = document.getElementById("save-design");
    const clearButton = document.getElementById("clear-design");

    const deleteButton = document.getElementById("delete-selected");

    const colorButtons = document.querySelectorAll(".color-btn");

    const toast = document.getElementById("toast");


    /* =========================
       CANVAS SETTINGS
    ========================= */

    const CANVAS_WIDTH = 360;
    const CANVAS_HEIGHT = 480;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;


    let shirtColor = "#ffffff";
    let selectedElement = null;

    let dragData = null;


    /* =========================
       DRAW T-SHIRT
    ========================= */

    function drawShirt() {

        ctx.clearRect(
            0,
            0,
            CANVAS_WIDTH,
            CANVAS_HEIGHT
        );

        ctx.save();

        ctx.fillStyle = shirtColor;

        ctx.strokeStyle = "#d1d5db";

        ctx.lineWidth = 2;

        /*
         * T-shirt shape
         */

        ctx.beginPath();

        // Left sleeve

        ctx.moveTo(85, 105);

        ctx.lineTo(25, 145);

        ctx.lineTo(65, 205);

        ctx.lineTo(105, 180);


        // Left body

        ctx.lineTo(105, 420);


        // Bottom

        ctx.lineTo(255, 420);


        // Right body

        ctx.lineTo(255, 180);


        // Right sleeve

        ctx.lineTo(295, 205);

        ctx.lineTo(335, 145);

        ctx.lineTo(275, 105);


        // Shoulder

        ctx.lineTo(225, 80);


        // Collar

        ctx.quadraticCurveTo(
            210,
            120,
            180,
            120
        );

        ctx.quadraticCurveTo(
            150,
            120,
            135,
            80
        );


        ctx.closePath();

        ctx.fill();

        ctx.stroke();


        /*
         * Collar
         */

        ctx.beginPath();

        ctx.arc(
            180,
            85,
            35,
            0,
            Math.PI
        );

        ctx.strokeStyle = "rgba(0,0,0,.12)";

        ctx.stroke();


        ctx.restore();
    }


    drawShirt();


    /* =========================
       SHIRT COLORS
    ========================= */

    colorButtons.forEach(button => {

        button.addEventListener("click", () => {

            colorButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            shirtColor = button.dataset.color;

            drawShirt();
        });

    });


    /* =========================
       ADD TEXT
    ========================= */

    addTextButton.addEventListener("click", () => {

        const text = textInput.value.trim();

        if (!text) {
            showToast("Please enter some text.");
            return;
        }

        const fontSize =
            parseInt(fontSizeInput.value) || 28;

        const color =
            textColorInput.value;

        createTextElement(
            text,
            fontSize,
            color
        );

        textInput.value = "";

    });


    function createTextElement(
        text,
        fontSize,
        color
    ) {

        const element =
            document.createElement("div");

        element.className = "draggable";

        element.textContent = text;

        element.dataset.type = "text";

        element.style.left = "110px";

        element.style.top = "210px";

        element.style.fontSize =
            `${fontSize}px`;

        element.style.fontWeight = "700";

        element.style.fontFamily =
            "Inter, Arial, sans-serif";

        element.style.color = color;

        elementsLayer.appendChild(element);

        makeDraggable(element);

        selectElement(element);
    }


    /* =========================
       IMAGE UPLOAD
    ========================= */

    imageUpload.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {

                showToast(
                    "Please upload a valid image."
                );

                return;
            }


            const reader =
                new FileReader();


            reader.onload = e => {

                createImageElement(
                    e.target.result
                );

            };


            reader.readAsDataURL(file);

            imageUpload.value = "";
        }
    );


    function createImageElement(src) {

        const wrapper =
            document.createElement("div");

        wrapper.className = "draggable";

        wrapper.dataset.type = "image";

        wrapper.style.left = "80px";

        wrapper.style.top = "160px";

        const img =
            document.createElement("img");

        img.src = src;

        img.style.width = "200px";

        img.style.height = "auto";

        wrapper.appendChild(img);

        elementsLayer.appendChild(wrapper);

        img.onload = () => {

            if (img.naturalWidth > img.naturalHeight) {

                img.style.width = "200px";

            } else {

                img.style.width = "160px";

            }

        };

        makeDraggable(wrapper);

        selectElement(wrapper);
    }


    /* =========================
       SELECT ELEMENT
    ========================= */

    function selectElement(element) {

        if (selectedElement) {

            selectedElement.classList.remove(
                "selected"
            );

        }

        selectedElement = element;

        element.classList.add("selected");
    }


    /* =========================
       DRAGGING
    ========================= */

    function makeDraggable(element) {

        element.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                selectElement(element);

                const layerRect =
                    elementsLayer.getBoundingClientRect();

                const elementRect =
                    element.getBoundingClientRect();


                dragData = {

                    element,

                    offsetX:
                        event.clientX -
                        elementRect.left,

                    offsetY:
                        event.clientY -
                        elementRect.top,

                    layerRect

                };


                element.setPointerCapture(
                    event.pointerId
                );

            }
        );


        element.addEventListener(
            "pointermove",
            event => {

                if (
                    !dragData ||
                    dragData.element !== element
                ) {
                    return;
                }


                const layerRect =
                    elementsLayer.getBoundingClientRect();


                let x =
                    event.clientX -
                    layerRect.left -
                    dragData.offsetX;


                let y =
                    event.clientY -
                    layerRect.top -
                    dragData.offsetY;


                const maxX =
                    elementsLayer.clientWidth -
                    element.offsetWidth;


                const maxY =
                    elementsLayer.clientHeight -
                    element.offsetHeight;


                x =
                    Math.max(
                        0,
                        Math.min(x, maxX)
                    );


                y =
                    Math.max(
                        0,
                        Math.min(y, maxY)
                    );


                element.style.left =
                    `${x}px`;

                element.style.top =
                    `${y}px`;

            }
        );


        element.addEventListener(
            "pointerup",
            () => {

                dragData = null;

            }
        );

    }


    /* =========================
       DELETE ELEMENT
    ========================= */

    deleteButton.addEventListener(
        "click",
        deleteSelected
    );


    function deleteSelected() {

        if (!selectedElement) {

            showToast(
                "Select an element first."
            );

            return;
        }


        selectedElement.remove();

        selectedElement = null;

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Delete" &&
                selectedElement
            ) {

                deleteSelected();

            }

        }
    );


    /* =========================
       CLICK EMPTY SPACE
    ========================= */

    elementsLayer.addEventListener(
        "pointerdown",
        event => {

            if (
                event.target === elementsLayer &&
                selectedElement
            ) {

                selectedElement.classList.remove(
                    "selected"
                );

                selectedElement = null;

            }

        }
    );


    /* =========================
       CLEAR DESIGN
    ========================= */

    clearButton.addEventListener(
        "click",
        () => {

            if (
                !confirm(
                    "Are you sure you want to clear your design?"
                )
            ) {
                return;
            }


            elementsLayer.innerHTML = "";

            selectedElement = null;

            drawShirt();

        }
    );


    /* =========================
       CREATE FINAL IMAGE
    ========================= */

    async function createFinalCanvas() {

        const finalCanvas =
            document.createElement("canvas");

        finalCanvas.width =
            CANVAS_WIDTH;

        finalCanvas.height =
            CANVAS_HEIGHT;

        const finalCtx =
            finalCanvas.getContext("2d");


        /*
         * Draw shirt
         */

        drawShirtOnContext(finalCtx);


        /*
         * Draw elements
         */

        const elements =
            elementsLayer.querySelectorAll(
                ".draggable"
            );


        for (const element of elements) {

            const x =
                parseFloat(element.style.left);

            const y =
                parseFloat(element.style.top);


            if (
                element.dataset.type ===
                "text"
            ) {

                finalCtx.font =
                    `${element.style.fontSize} ${element.style.fontFamily}`;

                finalCtx.fillStyle =
                    element.style.color;

                finalCtx.textBaseline =
                    "top";

                finalCtx.fillText(
                    element.textContent,
                    x,
                    y
                );

            }


            if (
                element.dataset.type ===
                "image"
            ) {

                const img =
                    element.querySelector("img");


                await waitForImage(img);


                const width =
                    parseFloat(img.style.width);


                const height =
                    img.naturalHeight /
                    img.naturalWidth *
                    width;


                finalCtx.drawImage(
                    img,
                    x,
                    y,
                    width,
                    height
                );

            }

        }


        return finalCanvas;
    }


    function drawShirtOnContext(context) {

        context.clearRect(
            0,
            0,
            CANVAS_WIDTH,
            CANVAS_HEIGHT
        );


        context.fillStyle =
            shirtColor;

        context.strokeStyle =
            "#d1d5db";

        context.lineWidth = 2;


        context.beginPath();


        context.moveTo(85, 105);

        context.lineTo(25, 145);

        context.lineTo(65, 205);

        context.lineTo(105, 180);

        context.lineTo(105, 420);

        context.lineTo(255, 420);

        context.lineTo(255, 180);

        context.lineTo(295, 205);

        context.lineTo(335, 145);

        context.lineTo(275, 105);

        context.lineTo(225, 80);


        context.quadraticCurveTo(
            210,
            120,
            180,
            120
        );


        context.quadraticCurveTo(
            150,
            120,
            135,
            80
        );


        context.closePath();

        context.fill();

        context.stroke();


        context.beginPath();

        context.arc(
            180,
            85,
            35,
            0,
            Math.PI
        );

        context.strokeStyle =
            "rgba(0,0,0,.12)";

        context.stroke();

    }


    function waitForImage(img) {

        return new Promise(resolve => {

            if (img.complete) {

                resolve();

                return;
            }


            img.onload =
                resolve;

        });

    }


    /* =========================
       DOWNLOAD
    ========================= */

    downloadButton.addEventListener(
        "click",
        async () => {

            const finalCanvas =
                await createFinalCanvas();


            const link =
                document.createElement("a");

            link.download =
                "my-tshirt-design.png";

            link.href =
                finalCanvas.toDataURL(
                    "image/png"
                );

            link.click();

            showToast(
                "Your design is ready!"
            );

        }
    );


    /* =========================
       SAVE TO SERVER
    ========================= */

    saveButton.addEventListener(
        "click",
        async () => {

            try {

                const finalCanvas =
                    await createFinalCanvas();


                const designData =
                    finalCanvas.toDataURL(
                        "image/png"
                    );


                const response =
                    await fetch(
                        "/save-design",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    design:
                                        designData
                                })
                        }
                    );


                if (!response.ok) {
                    throw new Error(
                        "Failed to save design"
                    );
                }


                showToast(
                    "Design saved successfully!"
                );

            } catch (error) {

                console.error(error);

                showToast(
                    "Could not save the design."
                );

            }

        }
    );


    /* =========================
       TOAST
    ========================= */

    function showToast(message) {

        toast.textContent =
            message;

        toast.classList.add("show");


        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2500);

    }

});
