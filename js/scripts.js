document.addEventListener("DOMContentLoaded", () => {

    const canvas =
        document.getElementById("tshirt-canvas");

    const ctx =
        canvas.getContext("2d");

    const elementsLayer =
        document.getElementById("elements-layer");


    const textInput =
        document.getElementById("text");

    const addTextButton =
        document.getElementById("add-text");

    const imageUpload =
        document.getElementById("image-upload");

    const downloadButton =
        document.getElementById("download-design");

    const clearButton =
        document.getElementById("clear-design");

    const deleteButton =
        document.getElementById("delete-selected");

    const selectedControls =
        document.getElementById("selected-controls");

    const scaleSlider =
        document.getElementById("scale-slider");

    const rotationSlider =
        document.getElementById("rotation-slider");

    const scaleValue =
        document.getElementById("scale-value");

    const rotationValue =
        document.getElementById("rotation-value");

    const scaleDown =
        document.getElementById("scale-down");

    const scaleUp =
        document.getElementById("scale-up");

    const toast =
        document.getElementById("toast");


    /* =========================
       SETTINGS
    ========================= */

    const WIDTH = 360;
    const HEIGHT = 480;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;


    let shirtColor = "#ffffff";

    let shirtSize = "M";

    let textColor = "#111111";

    let selectedElement = null;

    let dragData = null;


    /* =========================
       T-SHIRT SIZES
    ========================= */

    const sizes = {

        XS: {
            scale: .78
        },

        S: {
            scale: .88
        },

        M: {
            scale: 1
        },

        L: {
            scale: 1.08
        },

        XL: {
            scale: 1.15
        },

        XXL: {
            scale: 1.22
        }

    };


    /* =========================
       DRAW SHIRT
    ========================= */

    function drawShirt() {

        ctx.clearRect(
            0,
            0,
            WIDTH,
            HEIGHT
        );


        const sizeScale =
            sizes[shirtSize].scale;


        ctx.save();

        ctx.translate(
            WIDTH / 2,
            HEIGHT / 2
        );

        ctx.scale(
            sizeScale,
            sizeScale
        );

        ctx.translate(
            -WIDTH / 2,
            -HEIGHT / 2
        );


        ctx.fillStyle =
            shirtColor;

        ctx.strokeStyle =
            "#cfd3d8";

        ctx.lineWidth = 2;


        ctx.beginPath();

        ctx.moveTo(85, 105);

        ctx.lineTo(25, 145);

        ctx.lineTo(65, 205);

        ctx.lineTo(105, 180);

        ctx.lineTo(105, 420);

        ctx.lineTo(255, 420);

        ctx.lineTo(255, 180);

        ctx.lineTo(295, 205);

        ctx.lineTo(335, 145);

        ctx.lineTo(275, 105);

        ctx.lineTo(225, 80);


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


        /* collar */

        ctx.beginPath();

        ctx.arc(
            180,
            85,
            35,
            0,
            Math.PI
        );

        ctx.strokeStyle =
            "rgba(0,0,0,.12)";

        ctx.stroke();


        ctx.restore();

    }


    drawShirt();


    /* =========================
       SIZE SELECTION
    ========================= */

    document
        .querySelectorAll(".size-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".size-btn")
                        .forEach(btn =>
                            btn.classList.remove(
                                "active"
                            )
                        );


                    button.classList.add(
                        "active"
                    );


                    shirtSize =
                        button.dataset.size;


                    drawShirt();

                }
            );

        });


    /* =========================
       SHIRT COLORS
    ========================= */

    document
        .querySelectorAll(
            "#shirt-colors .color-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            "#shirt-colors .color-btn"
                        )
                        .forEach(btn =>
                            btn.classList.remove(
                                "active"
                            )
                        );


                    button.classList.add(
                        "active"
                    );


                    shirtColor =
                        button.dataset.color;


                    drawShirt();

                }
            );

        });


    /* =========================
       TEXT COLORS
    ========================= */

    document
        .querySelectorAll(
            "#text-colors .text-color"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            "#text-colors .text-color"
                        )
                        .forEach(btn =>
                            btn.classList.remove(
                                "active"
                            )
                        );


                    button.classList.add(
                        "active"
                    );


                    textColor =
                        button.dataset.color;


                    if (
                        selectedElement &&
                        selectedElement.dataset.type ===
                        "text"
                    ) {

                        selectedElement.style.color =
                            textColor;

                    }

                }
            );

        });


    /* =========================
       ADD TEXT
    ========================= */

    addTextButton.addEventListener(
        "click",
        addText
    );


    textInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                addText();

            }

        }
    );


    function addText() {

        const text =
            textInput.value.trim();


        if (!text) {

            showToast(
                "Enter some text first."
            );

            return;

        }


        const element =
            document.createElement("div");


        element.className =
            "draggable";


        element.dataset.type =
            "text";


        element.dataset.scale =
            "100";


        element.dataset.rotation =
            "0";


        element.textContent =
            text;


        element.style.left =
            "120px";


        element.style.top =
            "210px";


        element.style.fontSize =
            "28px";


        element.style.fontWeight =
            "700";


        element.style.color =
            textColor;


        element.style.fontFamily =
            "Inter, Arial, sans-serif";


        elementsLayer.appendChild(
            element
        );


        makeDraggable(element);

        selectElement(element);


        textInput.value = "";

    }


    /* =========================
       IMAGE
    ========================= */

    imageUpload.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];


            if (!file) return;


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showToast(
                    "Invalid image."
                );

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                e => {

                    addImage(
                        e.target.result
                    );

                };


            reader.readAsDataURL(
                file
            );


            imageUpload.value = "";

        }
    );


    function addImage(src) {

        const wrapper =
            document.createElement("div");


        wrapper.className =
            "draggable";


        wrapper.dataset.type =
            "image";


        wrapper.dataset.scale =
            "100";


        wrapper.dataset.rotation =
            "0";


        wrapper.style.left =
            "80px";


        wrapper.style.top =
            "160px";


        const img =
            document.createElement("img");


        img.src =
            src;


        img.style.width =
            "190px";


        wrapper.appendChild(
            img
        );


        elementsLayer.appendChild(
            wrapper
        );


        img.onload =
            () => {

                if (
                    img.naturalWidth >
                    img.naturalHeight
                ) {

                    img.style.width =
                        "210px";

                } else {

                    img.style.width =
                        "160px";

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


        selectedElement =
            element;


        element.classList.add(
            "selected"
        );


        selectedControls.classList.add(
            "visible"
        );


        const scale =
            parseFloat(
                element.dataset.scale || 100
            );


        const rotation =
            parseFloat(
                element.dataset.rotation || 0
            );


        scaleSlider.value =
            scale;


        rotationSlider.value =
            rotation;


        scaleValue.textContent =
            `${Math.round(scale)}%`;


        rotationValue.textContent =
            `${Math.round(rotation)}°`;

    }


    /* =========================
       DRAG
    ========================= */

    function makeDraggable(element) {

        element.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                selectElement(
                    element
                );


                const rect =
                    element.getBoundingClientRect();


                dragData = {

                    element,

                    offsetX:
                        event.clientX -
                        rect.left,

                    offsetY:
                        event.clientY -
                        rect.top

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
                        Math.min(
                            x,
                            maxX
                        )
                    );


                y =
                    Math.max(
                        0,
                        Math.min(
                            y,
                            maxY
                        )
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
       SCALE
    ========================= */

    scaleSlider.addEventListener(
        "input",
        () => {

            if (!selectedElement) return;


            const value =
                Number(
                    scaleSlider.value
                );


            updateScale(
                selectedElement,
                value
            );

        }
    );


    scaleDown.addEventListener(
        "click",
        () => {

            if (!selectedElement) return;


            let value =
                Number(
                    selectedElement.dataset.scale
                );


            value -= 10;


            value =
                Math.max(
                    30,
                    value
                );


            updateScale(
                selectedElement,
                value
            );

        }
    );


    scaleUp.addEventListener(
        "click",
        () => {

            if (!selectedElement) return;


            let value =
                Number(
                    selectedElement.dataset.scale
                );


            value += 10;


            value =
                Math.min(
                    250,
                    value
                );


            updateScale(
                selectedElement,
                value
            );

        }
    );


    function updateScale(
        element,
        value
    ) {

        element.dataset.scale =
            value;


        const rotation =
            element.dataset.rotation || 0;


        element.style.transform =
            `scale(${value / 100}) rotate(${rotation}deg)`;


        scaleSlider.value =
            value;


        scaleValue.textContent =
            `${Math.round(value)}%`;

    }


    /* =========================
       ROTATION
    ========================= */

    rotationSlider.addEventListener(
        "input",
        () => {

            if (!selectedElement) return;


            const rotation =
                Number(
                    rotationSlider.value
                );


            selectedElement.dataset.rotation =
                rotation;


            const scale =
                Number(
                    selectedElement.dataset.scale
                );


            selectedElement.style.transform =
                `scale(${scale / 100}) rotate(${rotation}deg)`;


            rotationValue.textContent =
                `${rotation}°`;

        }
    );


    /* =========================
       DELETE
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

        selectedElement =
            null;


        selectedControls.classList.remove(
            "visible"
        );

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
       CLICK EMPTY
    ========================= */

    elementsLayer.addEventListener(
        "pointerdown",
        event => {

            if (
                event.target ===
                elementsLayer
            ) {

                if (selectedElement) {

                    selectedElement.classList.remove(
                        "selected"
                    );

                }


                selectedElement =
                    null;


                selectedControls.classList.remove(
                    "visible"
                );

            }

        }
    );


    /* =========================
       CLEAR
    ========================= */

    clearButton.addEventListener(
        "click",
        () => {

            if (
                !confirm(
                    "Clear your entire design?"
                )
            ) {

                return;

            }


            elementsLayer.innerHTML =
                "";


            selectedElement =
                null;


            selectedControls.classList.remove(
                "visible"
            );


            drawShirt();

        }
    );


    /* =========================
       EXPORT
    ========================= */

    downloadButton.addEventListener(
        "click",
        async () => {

            const finalCanvas =
                await createFinalCanvas();


            const link =
                document.createElement(
                    "a"
                );


            link.download =
                `tshirt-${shirtSize}.png`;


            link.href =
                finalCanvas.toDataURL(
                    "image/png"
                );


            link.click();


            showToast(
                "Design downloaded!"
            );

        }
    );


    /* =========================
       FINAL CANVAS
    ========================= */

    async function createFinalCanvas() {

        const finalCanvas =
            document.createElement(
                "canvas"
            );


        finalCanvas.width =
            WIDTH;


        finalCanvas.height =
            HEIGHT;


        const finalCtx =
            finalCanvas.getContext(
                "2d"
            );


        drawShirtOnContext(
            finalCtx
        );


        const elements =
            elementsLayer.querySelectorAll(
                ".draggable"
            );


        for (
            const element of elements
        ) {

            const x =
                parseFloat(
                    element.style.left
                );


            const y =
                parseFloat(
                    element.style.top
                );


            const scale =
                Number(
                    element.dataset.scale ||
                    100
                ) / 100;


            const rotation =
                Number(
                    element.dataset.rotation ||
                    0
                );


            finalCtx.save();


            const width =
                element.offsetWidth *
                scale;


            const height =
                element.offsetHeight *
                scale;


            finalCtx.translate(
                x + width / 2,
                y + height / 2
            );


            finalCtx.rotate(
                rotation *
                Math.PI /
                180
            );


            finalCtx.scale(
                scale,
                scale
            );


            if (
                element.dataset.type ===
                "text"
            ) {

                finalCtx.font =
                    `${element.style.fontSize} ${element.style.fontFamily}`;


                finalCtx.fontWeight =
                    element.style.fontWeight;


                finalCtx.fillStyle =
                    element.style.color;


                finalCtx.textAlign =
                    "center";


                finalCtx.textBaseline =
                    "middle";


                finalCtx.fillText(
                    element.textContent,
                    0,
                    0
                );

            }


            if (
                element.dataset.type ===
                "image"
            ) {

                const img =
                    element.querySelector(
                        "img"
                    );


                if (img.complete) {

                    finalCtx.drawImage(
                        img,
                        -element.offsetWidth / 2,
                        -element.offsetHeight / 2,
                        element.offsetWidth,
                        element.offsetHeight
                    );

                }

            }


            finalCtx.restore();

        }


        return finalCanvas;

    }


    /* =========================
       DRAW SHIRT EXPORT
    ========================= */

    function drawShirtOnContext(
        context
    ) {

        const sizeScale =
            sizes[shirtSize].scale;


        context.save();


        context.translate(
            WIDTH / 2,
            HEIGHT / 2
        );


        context.scale(
            sizeScale,
            sizeScale
        );


        context.translate(
            -WIDTH / 2,
            -HEIGHT / 2
        );


        context.fillStyle =
            shirtColor;


        context.strokeStyle =
            "#cfd3d8";


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


        context.restore();

    }


    /* =========================
       TOAST
    ========================= */

    function showToast(
        message
    ) {

        toast.textContent =
            message;


        toast.classList.add(
            "show"
        );


        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );

    }

});
