document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tshirt-canvas');
    const ctx = canvas.getContext('2d');
    const canvasContainer = document.querySelector('.canvas-container');
    let selectedElement = null;
    let offsetX, offsetY;

    // Set initial canvas size and background color
    canvas.width = 300;
    canvas.height = 400;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text to canvas
    document.getElementById('add-text').addEventListener('click', () => {
        const text = document.getElementById('text').value;
        if (text) {
            addTextToCanvas(text);
        }
    });

    // Add image to canvas
    document.getElementById('image-upload').addEventListener('change', (e) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                addImageToCanvas(img);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    });

    // Add draggable text to canvas
    function addTextToCanvas(text) {
        const textElement = document.createElement('div');
        textElement.classList.add('draggable');
        textElement.textContent = text;
        textElement.style.left = '50px';
        textElement.style.top = '50px';
        textElement.style.fontSize = '20px';
        textElement.style.color = 'black';
        canvasContainer.appendChild(textElement);
        makeDraggable(textElement);
    }

    // Add draggable image to canvas
    function addImageToCanvas(img) {
        const imgElement = document.createElement('img');
        imgElement.classList.add('draggable');
        imgElement.src = img.src;
        imgElement.style.left = '50px';
        imgElement.style.top = '100px';
        imgElement.style.width = '150px';
        canvasContainer.appendChild(imgElement);
        makeDraggable(imgElement);
    }

    // Make element draggable
    function makeDraggable(element) {
        element.addEventListener('mousedown', (e) => {
            selectedElement = element;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
        });
    }

    // Handle dragging
    document.addEventListener('mousemove', (e) => {
        if (selectedElement) {
            selectedElement.style.left = `${e.clientX - offsetX}px`;
            selectedElement.style.top = `${e.clientY - offsetY}px`;
        }
    });

    // Stop dragging
    document.addEventListener('mouseup', () => {
        selectedElement = null;
    });

    // Download canvas as image
    document.getElementById('download-design').addEventListener('click', () => {
        updateCanvasFromElements();
        const link = document.createElement('a');
        link.download = 'tshirt-design.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    // Save canvas design to server
    document.getElementById('save-design').addEventListener('click', () => {
        updateCanvasFromElements();
        const designData = canvas.toDataURL();

        fetch('/save-design', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ design: designData }),
        })
        .then(response => response.json())
        .then(data => {
            alert('Design saved successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Update canvas with elements' positions
    function updateCanvasFromElements() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const elements = document.querySelectorAll('.draggable');
        elements.forEach(element => {
            if (element.tagName === 'DIV') {
                // Text element
                ctx.font = `${element.style.fontSize} Arial`;
                ctx.fillStyle = element.style.color;
                ctx.fillText(element.textContent, parseInt(element.style.left), parseInt(element.style.top));
            } else if (element.tagName === 'IMG') {
                // Image element
                const img = new Image();
                img.src = element.src;
                img.onload = () => {
                    ctx.drawImage(img, parseInt(element.style.left), parseInt(element.style.top), img.width, img.height);
                };
            }
        });
    }
});
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json({ limit: '10mb' })); // Increase the limit for large images

app.post('/save-design', (req, res) => {
    const designData = req.body.design.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(designData, 'base64');
    const filePath = path.join(__dirname, 'designs', `design-${Date.now()}.png`);

    fs.writeFile(filePath, buffer, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to save design' });
        }
        res.status(200).json({ message: 'Design saved successfully', filePath });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

