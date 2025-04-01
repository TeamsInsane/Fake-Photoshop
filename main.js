let canvas;
let ctx, buffer;
let imgData, original;


let image = new Image();
image.src = "test.png"

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

let firstData;

document.getElementById('inp').onchange = function(e) {
	let img = new Image();
	image = img;
	img.onload = draw;
	img.onerror = failed;
	img.src = URL.createObjectURL(this.files[0]);

	firstData = image;
}
function failed() {
	console.error("The provided file couldn't be loaded as an Image media");
}

let functionArr = {
	"BoxBlur": function () {
		let w = canvas.width,
			h = canvas.height;

		imgData = ctx.getImageData(0, 0, w, h);

		for (let y = 0; y <= h; y++) {
			for (let x = 0; x <= w; x++) {
				let r = 0,
					g = 0,
					b = 0;
				let value = 0,
					amount = 0;

				for (let i = -3; i <= 3; i++) {
					for (let j = -3; j <= 3; j++) {
						r += imgData.data[4 * (w * (y + i)) + 4 * (x + j)];
						g += imgData.data[4 * (w * (y + i)) + 4 * (x + j) + 1];
						b += imgData.data[4 * (w * (y + i)) + 4 * (x + j) + 2];

						amount++;
					}
				}

				value = Math.floor(r / amount);
				imgData.data[4 * (w * y) + (x * 4)] = value;

				value = Math.floor(g / amount);
				imgData.data[4 * (w * y) + (x * 4) + 1] = value;

				value = Math.floor(b / amount);
				imgData.data[4 * (w * y) + (x * 4) + 2] = value;
			}
		}

		newHistory(imgData); return imgData;
	},

	"GaussianBlur": function () {
		let w = canvas.width,
			h = canvas.height;

		imgData = ctx.getImageData(0, 0, w, h);

		let array = new Uint8ClampedArray(imgData.data.length);

		for (let y = 0; y <= h; y++) {
			for (let x = 0; x <= w; x++) {
				let total = 0;
				let r = 0,
					g = 0,
					b = 0;

				r = imgData.data[4 * (w * (y - 1)) + 4 * (x - 1)] * 1 + imgData.data[4 * (w * (y - 1)) + 4 * (x)] * 2 + imgData.data[4 * (w * (y - 1)) + 4 * (x + 1)] * 1 +
					imgData.data[4 * (w * (y)) + 4 * (x - 1)] * 2 + imgData.data[4 * (w * (y)) + 4 * (x)] * 4 + imgData.data[4 * (w * (y)) + 4 * (x + 1)] * 2 +
					imgData.data[4 * (w * (y + 1)) + 4 * (x - 1)] * 1 + imgData.data[4 * (w * (y + 1)) + 4 * (x)] * 2 + imgData.data[4 * (w * (y + 1)) + 4 * (x + 1)] * 1;

				g = imgData.data[4 * (w * (y - 1)) + 4 * (x - 1) + 1] * 1 + imgData.data[4 * (w * (y - 1)) + 4 * (x) + 1] * 2 + imgData.data[4 * (w * (y - 1)) + 4 * (x + 1) + 1] * 1 +
					imgData.data[4 * (w * (y)) + 4 * (x - 1) + 1] * 2 + imgData.data[4 * (w * (y)) + 4 * (x) + 1] * 4 + imgData.data[4 * (w * (y)) + 4 * (x + 1) + 1] * 2 +
					imgData.data[4 * (w * (y + 1)) + 4 * (x - 1) + 1] * 1 + imgData.data[4 * (w * (y + 1)) + 4 * (x) + 1] * 2 + imgData.data[4 * (w * (y + 1)) + 4 * (x + 1) + 1] * 1;

				b = imgData.data[4 * (w * (y - 1)) + 4 * (x - 1) + 2] * 1 + imgData.data[4 * (w * (y - 1)) + 4 * (x) + 2] * 2 + imgData.data[4 * (w * (y - 1)) + 4 * (x + 1) + 2] * 1 +
					imgData.data[4 * (w * (y)) + 4 * (x - 1) + 2] * 2 + imgData.data[4 * (w * (y)) + 4 * (x) + 2] * 4 + imgData.data[4 * (w * (y)) + 4 * (x + 1) + 2] * 2 +
					imgData.data[4 * (w * (y + 1)) + 4 * (x - 1) + 2] * 1 + imgData.data[4 * (w * (y + 1)) + 4 * (x) + 2] * 2 + imgData.data[4 * (w * (y + 1)) + 4 * (x + 1) + 2] * 1;

				total = Math.floor(r / 16);
				array[4 * (w * y) + (x * 4)] = total;

				total = Math.floor(g / 16);
				array[4 * (w * y) + (x * 4) + 1] = total;

				total = Math.floor(b / 16);
				array[4 * (w * y) + (x * 4) + 2] = total;

				array[4 * (w * y) + (x * 4) + 3] = 255;
			}
		}

		let reserve = new ImageData(array, w, h);

		imgData = reserve;

		newHistory(imgData); return imgData;
	},

	"Threshold": function () {
		let w = canvas.width,
			h = canvas.height;
		let threshold = prompt("Enter threshold value: ", "125");

		imgData = ctx.getImageData(0, 0, w, h);

		for (let i = 0; i < imgData.data.length; i += 4) {
			r = imgData.data[i];
			g = imgData.data[i + 1];
			b = imgData.data[i + 2];

			let v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;

			imgData.data[i] = v;
			imgData.data[i + 1] = v;
			imgData.data[i + 2] = v;
		}

		newHistory(imgData); return imgData;
	},

	"Grayscale": function () {
		let w = canvas.width,
			h = canvas.height;

		imgData = ctx.getImageData(0, 0, w, h);

		for (let i = 0; i < imgData.data.length; i += 4) {
			let v = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;

			imgData.data[i] = v;
			imgData.data[i + 1] = v;
			imgData.data[i + 2] = v;
		}

		newHistory(imgData); return imgData;
	},

	"BrightnessPlus": function () {
		let w = canvas.width,
			h = canvas.height;
		let brightness = 50;

		imgData = ctx.getImageData(0, 0, w, h);

		for (let i = 0; i < imgData.data.length; i += 4) {
			imgData.data[i] = clamp(imgData.data[i] + brightness, 0, 255);
			imgData.data[i + 1] = clamp(imgData.data[i + 1] + brightness, 0, 255);
			imgData.data[i + 2] = clamp(imgData.data[i + 2] + brightness, 0, 255);
		}

		newHistory(imgData); return imgData;
	},

	"BrightnessMinus": function () {
		let w = canvas.width,
			h = canvas.height;
		let brightness = -50;

		imgData = ctx.getImageData(0, 0, w, h);

		for (let i = 0; i < imgData.data.length; i += 4) {
			imgData.data[i] = clamp(imgData.data[i] + brightness, 0, 255);
			imgData.data[i + 1] = clamp(imgData.data[i + 1] + brightness, 0, 255);
			imgData.data[i + 2] = clamp(imgData.data[i + 2] + brightness, 0, 255);
		}

		newHistory(imgData); return imgData;
	},

	"Sobel": function () {
		let w = canvas.width,
			h = canvas.height;

		imgData = ctx.getImageData(0, 0, w, h);

		let array = new Uint8ClampedArray(imgData.data.length);

		for (let y = 0; y <= h; y++) {
			for (let x = 0; x <= w; x++) {
				let r = 0,
					g = 0,
					b = 0;
				let hr = 0,
					hg = 0,
					hb = 0;
				let vr = 0,
					vg = 0,
					vb = 0;

				for (let i = -1; i <= 1; i++) {
					for (let j = -1; j <= 1; j++) {
						if (j == 0) {
							vr += imgData.data[4 * (w * (y + i)) + 4 * (x + j)] * i * 2;
							vg += imgData.data[4 * (w * (y + i)) + 4 * (x + j) + 1] * i * 2;
							vb += imgData.data[4 * (w * (y + i)) + 4 * (x + j) + 2] * i * 2;
						} else {
							vr += imgData.data[4 * (w * (y + i)) + 4 * (x + j)] * i;
							vg += imgData.data[4 * (w * (y + i)) + 4 * (x + j) + 1] * i;
							vb += imgData.data[4 * (w * (y + i)) + 4 * (x + j) + 2] * i;
						}

						if (i == 0) {
							hr += imgData.data[4 * (w * (y + i)) + 4 * (x + j)] * j * 2;
							hg += imgData.data[4 * (w * (y + i)) + 4 * (x + j) + 1] * j * 2;
							hb += imgData.data[4 * (w * (y + i)) + 4 * (x + j) + 2] * j * 2;
						} else {
							hr += imgData.data[4 * (w * (y + i)) + 4 * (x + j)] * j;
							hg += imgData.data[4 * (w * (y + i)) + 4 * (x + j) + 1] * j;
							hb += imgData.data[4 * (w * (y + i)) + 4 * (x + j) + 2] * j;
						}
					}
				}

				if (((r = (Math.sqrt(hr ** 2 + vr ** 2) > 122) ? 255 : 0)) == 255) {
					g = b = r = 255;
				} else if (((g = (Math.sqrt(hg ** 2 + vg ** 2) > 122) ? 255 : 0)) == 255) {
					r = b = g = 255;
				} else if (((b = (Math.sqrt(hb ** 2 + vb ** 2) > 122) ? 255 : 0)) == 255) {
					r = g = b = 255;
				}

				array[4 * (w * y) + (4 * x)] = r;
				array[4 * (w * y) + (4 * x) + 1] = g;
				array[4 * (w * y) + (4 * x) + 2] = b;
				array[4 * (w * y) + (4 * x) + 3] = 255;
			}
		}

		let reserve = new ImageData(array, w, h);

		imgData = reserve;

		newHistory(imgData); return imgData;
	},

	"Laplacian": function () {
		let w = canvas.width,
			h = canvas.height;

		imgData = ctx.getImageData(0, 0, w, h);

		let gaussian = new Uint8ClampedArray(imgData.data.length);
		let array = new Uint8ClampedArray(imgData.data.length);

		for (let z = 0; z < 2; z++) {
			for (let y = 0; y <= h; y++) {
				for (let x = 0; x <= w; x++) {
					let total = 0;
					let r = 0,
						g = 0,
						b = 0;

					if (z == 0) {
						for (let i = -1; i <= 1; i++) {
							for (let j = -1; j <= 1; j++) {
								r = imgData.data[4 * (w * (y - 1)) + 4 * (x - 1)] * 1 + imgData.data[4 * (w * (y - 1)) + 4 * (x)] * 2 + imgData.data[4 * (w * (y - 1)) + 4 * (x + 1)] * 1 +
									imgData.data[4 * (w * (y)) + 4 * (x - 1)] * 2 + imgData.data[4 * (w * (y)) + 4 * (x)] * 4 + imgData.data[4 * (w * (y)) + 4 * (x + 1)] * 2 +
									imgData.data[4 * (w * (y + 1)) + 4 * (x - 1)] * 1 + imgData.data[4 * (w * (y + 1)) + 4 * (x)] * 2 + imgData.data[4 * (w * (y + 1)) + 4 * (x + 1)] * 1;

								g = imgData.data[4 * (w * (y - 1)) + 4 * (x - 1) + 1] * 1 + imgData.data[4 * (w * (y - 1)) + 4 * (x) + 1] * 2 + imgData.data[4 * (w * (y - 1)) + 4 * (x + 1) + 1] * 1 +
									imgData.data[4 * (w * (y)) + 4 * (x - 1) + 1] * 2 + imgData.data[4 * (w * (y)) + 4 * (x) + 1] * 4 + imgData.data[4 * (w * (y)) + 4 * (x + 1) + 1] * 2 +
									imgData.data[4 * (w * (y + 1)) + 4 * (x - 1) + 1] * 1 + imgData.data[4 * (w * (y + 1)) + 4 * (x) + 1] * 2 + imgData.data[4 * (w * (y + 1)) + 4 * (x + 1) + 1] * 1;

								b = imgData.data[4 * (w * (y - 1)) + 4 * (x - 1) + 2] * 1 + imgData.data[4 * (w * (y - 1)) + 4 * (x) + 2] * 2 + imgData.data[4 * (w * (y - 1)) + 4 * (x + 1) + 2] * 1 +
									imgData.data[4 * (w * (y)) + 4 * (x - 1) + 2] * 2 + imgData.data[4 * (w * (y)) + 4 * (x) + 2] * 4 + imgData.data[4 * (w * (y)) + 4 * (x + 1) + 2] * 2 +
									imgData.data[4 * (w * (y + 1)) + 4 * (x - 1) + 2] * 1 + imgData.data[4 * (w * (y + 1)) + 4 * (x) + 2] * 2 + imgData.data[4 * (w * (y + 1)) + 4 * (x + 1) + 2] * 1;

								total = Math.floor(r / 16);
								gaussian[4 * (w * y) + (x * 4)] = total;

								total = Math.floor(g / 16);
								gaussian[4 * (w * y) + (x * 4) + 1] = total;

								total = Math.floor(b / 16);
								gaussian[4 * (w * y) + (x * 4) + 2] = total;

								gaussian[4 * (w * y) + (x * 4) + 3] = 255;
							}
						}
					} else {
						for (let i = -1; i <= 1; i++) {
							for (let j = -1; j <= 1; j++) {
								if (i == 0 && j == 0) {
									r += gaussian[4 * (w * (y + i)) + 4 * (x + j)] * 8;
									g += gaussian[4 * (w * (y + i)) + 4 * (x + j) + 1] * 8;
									b += gaussian[4 * (w * (y + i)) + 4 * (x + j) + 2] * 8;
								} else {
									r += gaussian[4 * (w * (y + i)) + 4 * (x + j)] * -1;
									g += gaussian[4 * (w * (y + i)) + 4 * (x + j) + 1] * -1;
									b += gaussian[4 * (w * (y + i)) + 4 * (x + j) + 2] * -1;
								}
							}
						}

						let grey = (r + g + b) / 3;

						array[4 * (w * y) + (x * 4)] = grey;
						array[4 * (w * y) + (x * 4) + 1] = grey;
						array[4 * (w * y) + (x * 4) + 2] = grey;
						array[4 * (w * y) + (x * 4) + 3] = 255;
					}
				}
			}
		}

		let reserve = new ImageData(array, w, h);

		imgData = reserve;

		newHistory(imgData); return imgData;
	},

	"Sharpen": function () {
		let w = canvas.width,
			h = canvas.height;

		imgData = ctx.getImageData(0, 0, w, h);

		let laplacian = new Uint8ClampedArray;
		let copy = original;

		laplacian = functionArr["Laplacian"]();

		for (let y = 0; y <= h; y++) {
			for (let x = 0; x <= w; x++) {
				copy.data[4 * (w * y) + (4 * x)] += laplacian.data[4 * (w * y) + (4 * x)];
				copy.data[4 * (w * y) + (4 * x) + 1] += laplacian.data[4 * (w * y) + (4 * x) + 1];
				copy.data[4 * (w * y) + (4 * x) + 2] += laplacian.data[4 * (w * y) + (4 * x) + 2];
			}
		}

		return copy;
	},

	"Unsharpen": function () {
		let w = canvas.width,
			h = canvas.height;

		imgData = ctx.getImageData(0, 0, w, h);

		let gaussian = new Uint8ClampedArray;

		gaussian = functionArr["GaussianBlur"]().data;

		let data = new ImageData(gaussian, w, h);
		let temp = new Uint8ClampedArray(imgData.data.length);

		for (let y = 0; y <= h; y++) {
			for (let x = 0; x <= w; x++) {
				temp[4 * (w * y) + (4 * x)] = imgData.data[4 * (w * y) + (4 * x)] - data.data[4 * (w * y) + (4 * x)];
				temp[4 * (w * y) + (4 * x) + 1] = imgData.data[4 * (w * y) + (4 * x) + 1] - data.data[4 * (w * y) + (4 * x) + 1];
				temp[4 * (w * y) + (4 * x) + 2] = imgData.data[4 * (w * y) + (4 * x) + 2] - data.data[4 * (w * y) + (4 * x) + 2];
				temp[4 * (w * y) + (4 * x) + 3] = 255;
			}
		}

		let data1 = new ImageData(temp, w, h);
		let temp1 = new Uint8ClampedArray(imgData.data.length);

		for (let y = 0; y <= h; y++) {
			for (let x = 0; x <= w; x++) {
				temp1[4 * (w * y) + (4 * x)] = imgData.data[4 * (w * y) + (4 * x)] + data1.data[4 * (w * y) + (4 * x)];
				temp1[4 * (w * y) + (4 * x) + 1] = imgData.data[4 * (w * y) + (4 * x) + 1] + data1.data[4 * (w * y) + (4 * x) + 1];
				temp1[4 * (w * y) + (4 * x) + 2] = imgData.data[4 * (w * y) + (4 * x) + 2] + data1.data[4 * (w * y) + (4 * x) + 2];
				temp1[4 * (w * y) + (4 * x) + 3] = 255;
			}
		}

		let reserve = new ImageData(temp1, w, h);

		imgData = reserve;

		newHistory(imgData); return imgData;
	},

	"Red": function () {
		let w = canvas.width,
			h = canvas.height;

		imgData = ctx.getImageData(0, 0, w, h);

		for (let i = 0; i < imgData.data.length; i += 4) {
			let v = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;

			imgData.data[i] = v;
			imgData.data[i + 1] = 0;
			imgData.data[i + 2] = 0;
		}

		newHistory(imgData); return imgData;
	},

	"Green": function () {
		let w = canvas.width,
			h = canvas.height;

		imgData = ctx.getImageData(0, 0, w, h);

		for (let i = 0; i < imgData.data.length; i += 4) {
			let v = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;

			imgData.data[i] = 0;
			imgData.data[i + 1] = v;
			imgData.data[i + 2] = 0;
		}

		newHistory(imgData); return imgData;
	},
	"Blue": function () {
		let w = canvas.width,
			h = canvas.height;

		imgData = ctx.getImageData(0, 0, w, h);

		for (let i = 0; i < imgData.data.length; i += 4) {
			let v = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;

			imgData.data[i] = 0;
			imgData.data[i + 1] = 0;
			imgData.data[i + 2] = v;
		}

		newHistory(imgData); return imgData;
	},
	"Clear": function () {
		let w = canvas.width,
			h = canvas.height;

		ctx.clearRect(0, 0, w, h);
	},
	"Reload": function () {
		resizeCanvas(firstData.width, firstData.height);
		useFX = 0;
		return firstData;
	},
	"Random": function () {
		let w = canvas.width,
			h = canvas.height;

		imgData = ctx.getImageData(0, 0, w, h);

		for (let i = 0; i < imgData.data.length; i += 4) {

			imgData.data[i] = imgData.data[i] + Math.floor(Math.random() * 10);
			imgData.data[i + 1] = imgData.data[i] + Math.floor(Math.random() * 10);
			imgData.data[i + 2] = imgData.data[i] + Math.floor(Math.random() * 10);
		}

		newHistory(imgData); return imgData;
	},
	"BoostRed": function () {
		let w = canvas.width,
			h = canvas.height;

		imgData = ctx.getImageData(0, 0, w, h);

		for (let i = 0; i < imgData.data.length; i += 4) {

			imgData.data[i] = imgData.data[i] + 10;
		}

		newHistory(imgData); return imgData;
	},
	"BoostGreen": function () {
		let w = canvas.width,
			h = canvas.height;

		imgData = ctx.getImageData(0, 0, w, h);

		for (let i = 0; i < imgData.data.length; i += 4) {

			imgData.data[i + 1] = imgData.data[i + 1] + 10;
		}

		newHistory(imgData); return imgData;
	},
	"BoostBlue": function () {
		let w = canvas.width,
			h = canvas.height;

		imgData = ctx.getImageData(0, 0, w, h);

		for (let i = 0; i < imgData.data.length; i += 4) {

			imgData.data[i + 2] = imgData.data[i + 2] + 10;
		}

		newHistory(imgData); return imgData;
	},
	"Inverse": function () {
		let w = canvas.width,
			h = canvas.height;

		imgData = ctx.getImageData(0, 0, w, h);

		for (let i = 0; i < imgData.data.length; i += 4) {

			imgData.data[i] = 255 - imgData.data[i];
			imgData.data[i + 1] = 255 - imgData.data[i + 1];
			imgData.data[i + 2] = 255 - imgData.data[i + 2];
		}

		newHistory(imgData); return imgData;
	},
	"undo": function () {
		if (history.length > 2) {
			loadHistory();
			return history[history.length - 1];
		}
		else {
			return original;
		}
	},
	"redo": function () {
		if (redohistory.length > 0) {
			count++
			history.push(redohistory[count - 1]);
			return redohistory[count - 1];
		}
		else {
			return original;
		}
	}
};
let count = 0;
image.onload = function () {
	if (!used) {
		image.crossOrigin = "anonymous";

		init();

		let filters = document.getElementsByClassName("filter");

		for (let i = 0; i < filters.length; i++) {
			filters[i].addEventListener("click", function () {
				applyFilter(functionArr[filters[i].value]());
			});
		}

		used = true;
	} else {
		draw();
	}

	chart();
}

canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
let used = false;

function applyFilter(filter) {
	if (filter === undefined) return;

	if (useFX == 0){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.putImageData(filter, 0, 0);
	}
	else{
		if (withLine){
			let canvasPic = new Image();
			canvasPic.src = beforeCropImage;
			canvasPic.onload = function () {
				ctx.drawImage(canvasPic, 0, 0);
				withLine = false;
				ctx.clearRect(x1, y1, x2 - x1, y2 - y1);
				ctx.putImageData(filter, 0, 0, x1, y1, x2 - x1, y2 - y1);
			}
		} else {
			ctx.clearRect(x1, y1, x2 - x1, y2 - y1);
			ctx.putImageData(filter, 0, 0, x1, y1, x2 - x1, y2 - y1);
		}
	}
}

function initBackground() {
	document.body.appendChild(canvas);
}

function resizeCanvas(width = image.naturalWidth, height = image.naturalHeight){
	if (width === 0 && height === 0) return;
	if (width < 500) canvas.width = width;
	else canvas.width = 500;
	if (height < 500) canvas.height = height;
	else canvas.height = 500;
}

function init() {
	initBackground();
	canvas.addEventListener("mousemove", function (e) {
		findxy('move', e)
	}, false);
	canvas.addEventListener("mousedown", function (e) {
		findxy('down', e)
	}, false);
	canvas.addEventListener("mouseup", function (e) {
		findxy('up', e)
	}, false);
	canvas.addEventListener("mouseout", function (e) {
		findxy('out', e)
	}, false);
	canvas.addEventListener("mousedown", e => crop(e));
	canvas.addEventListener("mousedown", e => getMousePosition(e));

	const cs = document.querySelector('#select');
	cs.addEventListener("change", (e) =>{
		if (!cs.checked){
			useFX = 0;
			click = 0;
			if (withLine) {
				let canvasPic = new Image();
				canvasPic.src = beforeCropImage;
				canvasPic.onload = function () {
					ctx.drawImage(canvasPic, 0, 0);
					withLine = false;
				}
			}
		}
	});
}

function draw() {
	resizeCanvas();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
	console.log(isCropOn)
	original = ctx.getImageData(0, 0, canvas.width, canvas.height);
	if (!cropLoad) firstData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	else {
		cropLoad = false;
	}
	history = [];
	redohistory = [];
	cPushArray = [];
	history.push(original);
}

let redohistory = [];
let history = [];

function newHistory(filter) {
	history.push(filter);
}

function loadHistory() {
	redohistory.push(history[history.length - 1]);
	history.pop();
}


function vanish(div) {
	var x = document.getElementById(div);
	if (x.style.display === "none") {
		x.style.display = "block";
	} else {
		x.style.display = "none";
	}
}

let flag = false,
	prevX = 0,
	currX = 0,
	prevY = 0,
	currY = 0,
	dot_flag = false;

let x = "black",
	y = 2;

let cPushArray = [];
let cStep = -1;

function color(obj) {
	switch (obj.id) {
		case "green":
			x = "green";
			break;
		case "blue":
			x = "blue";
			break;
		case "red":
			x = "red";
			break;
		case "yellow":
			x = "yellow";
			break;
		case "orange":
			x = "orange";
			break;
		case "black":
			x = "black";
			break;
		case "white":
			x = "white";
			break;
	}
	if (x === "white") y = 14;
	else y = 2;
}

function drawSlikar() {
	ctx.beginPath();
	ctx.moveTo(prevX, prevY);
	ctx.lineTo(currX, currY);
	ctx.strokeStyle = x;
	ctx.lineWidth = y;
	ctx.stroke();
	ctx.closePath();
}

function findxy(res, e) {
	if (res === 'down') {
		const cb = document.querySelector('#accept');
		const cs = document.querySelector('#select');
		if (!cb.checked && !isCropOn && !cs.checked) {
			cPush();
			prevX = currX;
			prevY = currY;
			currX = e.clientX - canvas.offsetLeft + document.documentElement.scrollLeft;
			currY = e.clientY - canvas.offsetTop + document.documentElement.scrollTop;

			flag = true;
			dot_flag = true;
			if (dot_flag) {
				ctx.beginPath();
				ctx.fillStyle = x;
				ctx.fillRect(currX, currY, 2, 2);
				ctx.closePath();
				dot_flag = false;
			}
		} else if (cb.checked){
			document.getElementById("savedC").innerText=hex;
			savedHex=hex;
		}
	}
	if (res === 'up' || res === "out") {
		flag = false;
	}
	if (res === 'move') {
		if (flag) {
			prevX = currX;
			prevY = currY;
			currX = e.clientX - canvas.offsetLeft + document.documentElement.scrollLeft;
			currY = e.clientY - canvas.offsetTop + document.documentElement.scrollTop;
			drawSlikar();
		}
	}
}

function cPush(){
	cPushArray.push(canvas.toDataURL());
}

function cUndo() {
	if (cPushArray.length > 0) {
		let canvasPic = new Image();
		canvasPic.src = cPushArray[cPushArray.length - 1];
		canvasPic.onload = function () {
			ctx.drawImage(canvasPic, 0, 0)
		}
		cPushArray.pop();
	}
}

function cErase(){
	if (cPushArray.length === 0) return;
	let canvasPic = new Image();
	canvasPic.src = cPushArray[0];
	canvasPic.onload = function () {
		ctx.drawImage(canvasPic, 0, 0)
	}

	cPushArray = [];
}

function updateChart(data, width) {
	const buckets = generateBucketsByColor(data, width, 5);

	let chart = new CanvasJS.Chart("chart-container", {
		backgroundColor: "#282828",
		animationEnabled: true,
		axisX: {
			title: "Buckets",
			fontColor: "#fff",
			titleFontColor: "#fff",
			labelFontColor: "#fff",
			tickColor: "#fff",
		},
		axisY: {
			title: "No. of Pixels",
			titleFontColor: "#fff",
			lineColor: "#fff",
			labelFontColor: "#fff",
			tickColor: "#fff",
			fontColor: "#fff",
		},
		data: [
			{
				type: "column",
				name: "red",
				legendText: "red",
				color: "red",
				showInLegend: true,
				dataPoints: buckets["R"],
			},
			{
				type: "column",
				name: "green",
				legendText: "green",
				color: "green",
				showInLegend: true,
				dataPoints: buckets["G"],
			},
			{
				type: "column",
				name: "blue",
				legendText: "blue",
				color: "blue",
				showInLegend: true,
				dataPoints: buckets["B"],
			},
		],
	});

	chart.render();
}

function generateBucketsByColor(data, imgWidth, numOfBuckets, colorKey) {
	const originalImg = convertTo2D(data, imgWidth);

	const bucketSize = 255 / numOfBuckets;

	if (Math.floor(bucketSize) !== bucketSize) {
		alert("Invalid num of buckets");
		return;
	}

	const buckets = { R: [], G: [], B: [] };

	for (let k = 0; k < numOfBuckets; k++) {
		const startVal = k === 0 ? bucketSize * k : bucketSize * k + 1;
		const endVal = startVal + bucketSize - 1;

		const valCount = { R: 0, G: 0, B: 0 };

		for (let i = 0; i < originalImg.length; i++) {
			for (let j = 0; j < originalImg[i].length; j++) {
				if (
					originalImg[i][j]["R"] >= startVal &&
					originalImg[i][j]["R"] <= endVal
				)
					valCount.R++;

				if (
					originalImg[i][j]["G"] >= startVal &&
					originalImg[i][j]["G"] <= endVal
				)
					valCount.G++;

				if (
					originalImg[i][j]["B"] >= startVal &&
					originalImg[i][j]["B"] <= endVal
				)
					valCount.B++;
			}
		}

		for (const [key, value] of Object.entries(buckets)) {
			buckets[key].push({
				label: `${startVal}-${endVal}`,
				y: valCount[key],
				x: k,
			});
		}
	}

	return buckets;
}

function convertTo2D(data, imgWidth) {
	const objectArr = [[]];

	let row = 0;
	for (let i = 0; i < data.length; i = i + 4) {
		objectArr[row].push({
			R: data[i],
			G: data[i + 1],
			B: data[i + 2],
			A: data[i + 3],
		});

		if (i / 4 === imgWidth * (row + 1)) {
			objectArr.push([]);
			row++;
		}
	}

	return objectArr;
}

function chart(){
	imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	updateChart(imgData.data, canvas.width);
}

let savedHex;
let hex;
let coord;

canvas.addEventListener("mousemove",function(e){
	let pos = getPosition(this);
	let x = e.pageX - pos.x;
	let y = e.pageY - pos.y;
	let c = this.getContext('2d');
	let p = c.getImageData(x, y, 1, 1).data;

	if((p[0] == 0) && (p[1] == 0) && (p[2] == 0) && (p[3] == 0)){
		coord += " (Transparent color detected, cannot be converted to HEX)";
	}

	hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);

	document.getElementById("barva").innerHTML = hex;
	document.getElementById("barva2").style.backgroundColor = hex;
},false);

function getPosition(obj) {
	let curleft = 0, curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
		return { x: curleft, y: curtop };
	}
	return undefined;
}

function rgbToHex(r, g, b) {
	if (r > 255 || g > 255 || b > 255)
		throw "Invalid color component";
	return ((r << 16) | (g << 8) | b).toString(16);
}

let cropPoints = [];
let isCropOn = false, cropLoad = false;
let cropButton = document.getElementById("crop");
let cropInfo = document.getElementById("cropInfo");
let beforeCropImage;

function toggleCrop(){
	isCropOn = !isCropOn;

	if (isCropOn){
		beforeCropImage = canvas.toDataURL();
		cropButton.classList.add("active");
		cropButton.innerHTML = "Stop crop";
		cropInfo.innerHTML = "Select first point";

	} else {
		if (cropPoints.length === 2) applyCrop();
		cropButton.classList.remove("active");
		cropButton.innerHTML = "Crop";
		cropInfo.innerHTML = "";

		cropPoints = [];
	}
}

function crop(e){
	if (!isCropOn) return;
	if (cropPoints.length === 2){
		cropPoints = [];
		let canvasPic = new Image();
		canvasPic.src = beforeCropImage;
		canvasPic.onload = function () {
			ctx.drawImage(canvasPic, 0, 0)
		}
	}

	cropPoints.push([e.offsetX, e.offsetY]);

	if (cropPoints.length === 2){
		let x = cropPoints[0][0];
		let y = cropPoints[0][1];
		let w = cropPoints[1][0] - x;
		let h = cropPoints[1][1] - y;
		ctx.beginPath();
		ctx.rect(x, y, w, h);
		ctx.stroke();
		cropInfo.innerHTML = "Stop crop to apply";
	} else {
		cropInfo.innerHTML = "Select second point";
	}
}

function applyCrop(){
	cropLoad = true;
	let x = cropPoints[0][0];
	let y = cropPoints[0][1];
	let w = cropPoints[1][0] - x;
	let h = cropPoints[1][1] - y;

	const tmpCanvas = document.createElement("canvas");
	const tmpCtx = tmpCanvas.getContext("2d");

	tmpCanvas.height = canvas.height;
	tmpCanvas.width = canvas.width;

	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

	const imgData = ctx.getImageData(x, y, w, h);

	tmpCanvas.width = w;
	tmpCanvas.height = h;
	tmpCtx.putImageData(imgData, 0, 0);

	image.src = tmpCanvas.toDataURL();

	history = [];
	redohistory = [];
}

function download(){
	const link = document.createElement("a");
	link.href = canvas.toDataURL("image/png");
	link.download = "Untitled.png";
	link.click();
}

let x1, x2, y1, y2, click = 0, useFX = 0, withLine = false;

function getMousePosition(event) {
	const cs = document.querySelector('#select');
	if (!cs.checked) return;
	let x = event.clientX - canvas.offsetLeft + document.documentElement.scrollLeft;
	let y = event.clientY - canvas.offsetTop + document.documentElement.scrollTop;

	if (click == 2){
		click = 0;
		if (withLine) {
			let canvasPic = new Image();
			canvasPic.src = beforeCropImage;
			canvasPic.onload = function () {
				ctx.drawImage(canvasPic, 0, 0);
				beforeCropImage = canvas.toDataURL();
			}
		}
	}

	if (click == 0) {
		beforeCropImage = canvas.toDataURL();
		x1 = x;
		y1 = y;
		click = 1;
		document.getElementById("x1").innerText = parseInt(x1).toString();
		document.getElementById("y1").innerText = parseInt(y1).toString();
	} else if (click == 1) {
		x2 = x;
		y2 = y;
		click = 0;
		document.getElementById("x2").innerText = parseInt(x2).toString();
		document.getElementById("y2").innerText = parseInt(y2).toString();
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'red';
		ctx.rect(x1, y1, x2 - x1, y2 - y1);
		ctx.stroke();
		withLine = true;
		click = 2;
		useFX = 1;
	}
}