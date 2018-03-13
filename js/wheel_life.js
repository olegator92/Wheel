/**
 *
 * @param settings
 */
function getWheelLifeInstance(settings)
{
    /**
     *
     * @type {{canvas: boolean, ctx: boolean, areaGradWidth: number, areaLevelWidth: number, currentAreaLevel: number, width: number, height: number, circleRadius: number, todayStr: string, images: Array, imagesToLoad: number, scaleCoef: number, demoInterval: null, demoFrameNum: number, demoFramesInterval: null, draw: Function, prepare: Function, preloadImage: Function, onAllImagesLoaded: Function, onMouseMove: Function, isMouseInThatSector: Function, downloadImage: Function, saveImage: Function, demo: Function, demoFrame: Function, result: Function}}
     */    
    var wheelLife = {
        canvas: false,
        ctx: false,
        isDrawSimple: false,
        areas: [],

        areaGradWidth: 45,
        areaLevelWidth: 0,
        currentAreaLevel: -1,  // Уровень в сфере [1-10]     -1=вне сферы    0 приравнивается 1
        width: 0,
        height: 0,
        circleRadius: 0,
        todayStr: '',
        images: [],
        imagesToLoad: 0,
        scaleCoef: 2,
        demoInterval: null,
        demoFrameNum: 0,
        demoFramesInterval: null,

        draw: function (canvasId) {
            wheelLife.prepare(canvasId);

            if (! wheelLife.isDrawSimple) {
                $(wheelLife.canvas).bind('mousemove', wheelLife.onMouseMove);
                $(wheelLife.canvas).bind('click', wheelLife.onMouseMove);
            }
        },

        prepare: function (canvasId) {
            wheelLife.canvas = document.getElementById(canvasId);
            wheelLife.ctx = wheelLife.canvas.getContext('2d');

            // Сжимаем отображаемый вид, чтобы улучшить качество - это такой трюк
            if (screen.width < $(wheelLife.canvas).width()) {
                // Для меньших экранов - делаем зум
                $(wheelLife.canvas).css('width', screen.width - 10);
                var height = $(wheelLife.canvas).height() * (screen.width - 10) / 900;
                $(wheelLife.canvas).css('height', height);
            }

            wheelLife.scaleCoef = 1800 / $(wheelLife.canvas).width();
			//wheelLife.scaleCoef = 2;
			log('wheelLife.scaleCoef: ' + wheelLife.scaleCoef);
            wheelLife.ctx.scale(wheelLife.scaleCoef, wheelLife.scaleCoef);

            // Константы для колеса
            wheelLife.width = $(wheelLife.canvas).width();
            wheelLife.height = $(wheelLife.canvas).height();
			log('wheelLife.width: ' + wheelLife.width);
			log('wheelLife.height: ' + wheelLife.height);
			
            wheelLife.circleRadius = Math.round(wheelLife.height / 3)/* + 30*/;
			log('wheelLife.circleRadius: ' + wheelLife.circleRadius);
			
			//wheelLife.circleRadius = 100;
            wheelLife.areaLevelWidth = wheelLife.circleRadius / 10;
            wheelLife.areaGradWidth = 360 / wheelLife.areas.length;

            // Текущая дата
            var today = new Date();
            wheelLife.todayStr = today.getDate() + '.' + (today.getMonth() + 1 < 10 ? '0' : '') + (today.getMonth() + 1) + '.' + today.getFullYear();

            // Preload all images
            //wheelLife.preloadImage('pointer', '/img/pic/pointer.png');

            if (wheelLife.scaleCoef > 4) {
                // Отодвигаем боковые кнопки на телефоне
                $('#button-download-wheel').css('top', '1px').css('right', '1px');
                $('#button-download-wheel a').css('padding', '5px');
                $('#button-clear-areas').css('top', '1px').css('left', '1px');
            }
			wheelLife.onMouseMove({offsetX: -1, offsetY: -1, type: 'mousemove'});

        },

        preloadImage: function (name, url) {
            var img = new Image();
            img.src = url;
            img.onload = wheelLife.onAllImagesLoaded();
            wheelLife.images[name] = img;
            wheelLife.imagesToLoad++;
        },

        onAllImagesLoaded: function () {
            wheelLife.imagesToLoad--;

            // Прорисовываем первый раз экран
            if (wheelLife.imagesToLoad < 1) wheelLife.onMouseMove({offsetX: -1, offsetY: -1, type: 'mousemove'}); // Simulate click
        },

        onMouseMove: function (e) {
            var currentArea = 0; // В какой сфере сейчас мышка
            var countAreaClicked = 0;
            wheelLife.currentAreaLevel = -1;

            if (e.type == 'mousemove' && wheelLife.demoFrameNum > 0) {
                clearInterval(wheelLife.demoFramesInterval);
                wheelLife.demoFrameNum = 0;
            }

            wheelLife.ctx.clearRect(0, 0, wheelLife.width + 10, wheelLife.height + 10);
            wheelLife.ctx.rect(0, 0, wheelLife.width, wheelLife.height);
            //wheelLife.ctx.fillStyle = 'antiquewhite';
			wheelLife.ctx.fillStyle = 'white';
            wheelLife.ctx.fill();

            var x = e.offsetX - wheelLife.width / 2;
            var y = wheelLife.height / 2 - e.offsetY;
			
            // Draw areas
            for (var i = 0; i < wheelLife.areas.length; i++) {
                // half doughnut
                wheelLife.ctx.beginPath();
                var gradBegin = i * wheelLife.areaGradWidth - 90 ;

                var radBegin = gradBegin * Math.PI / 180;
                var radEnd = (gradBegin + wheelLife.areaGradWidth) * Math.PI / 180;

                var areaLevel = wheelLife.areas[i][3];
                if (areaLevel > 10) areaLevel = 10;
                var currentRadius = areaLevel * wheelLife.areaLevelWidth;

                if (wheelLife.isMouseInThatSector(gradBegin, x, y, i + 1)) {
                    currentArea = i + 1;
                    currentRadius = wheelLife.currentAreaLevel * wheelLife.areaLevelWidth;

                    if (e.type == 'click') {
                        wheelLife.areas[i][3] = wheelLife.currentAreaLevel;

                        // Stop demo play
                        clearInterval(wheelLife.demoInterval);
                    }
                }

                // Сколько сфер задано
                if (wheelLife.areas[i][3] < 11) countAreaClicked++; // Значение задано

                // Fill area
                wheelLife.ctx.arc(wheelLife.width / 2, wheelLife.height / 2, currentRadius, radBegin, radEnd, false); // outer (filled)
                wheelLife.ctx.arc(wheelLife.width / 2, wheelLife.height / 2, 0, radBegin, radEnd, true); // outer (unfills it)
                wheelLife.ctx.fillStyle = '#' + wheelLife.areas[i][2];
                wheelLife.ctx.fill();

                // Fill area background
                wheelLife.ctx.arc(wheelLife.width / 2, wheelLife.height / 2, wheelLife.circleRadius, radBegin, radEnd, false); // outer (filled)
                wheelLife.ctx.arc(wheelLife.width / 2, wheelLife.height / 2, 0, radBegin, radEnd, true); // outer (unfills it)

                wheelLife.ctx.save();

				wheelLife.ctx.globalAlpha = 0.3;
				wheelLife.ctx.fill();
                wheelLife.ctx.restore();
            }

            // Draw areas circle around
            wheelLife.ctx.beginPath();
            wheelLife.ctx.arc(wheelLife.width / 2, wheelLife.height / 2, wheelLife.circleRadius, 0, 360 * Math.PI / 180);
            wheelLife.ctx.lineWidth = 1;
            wheelLife.ctx.strokeStyle = '#550000';
            wheelLife.ctx.save();

            // Draw areas names
            wheelLife.ctx.font = '10pt verdana';
            var textMargin = 125;
            /*if (wheelLife.scaleCoef > 2) {
                wheelLife.ctx.font = '10px verdana';
                textMargin = 15;
            }
            if (wheelLife.scaleCoef > 4) {
                textMargin = 2;
            }*/
            wheelLife.ctx.textBaseline = "center";
            wheelLife.ctx.shadowColor = "#000000";
            wheelLife.ctx.shadowOffsetX = 1;
            wheelLife.ctx.shadowOffsetY = 1;
            wheelLife.ctx.shadowBlur = 0;

            wheelLife.ctx.setTransform(wheelLife.scaleCoef, 0, 0, wheelLife.scaleCoef, 0, 0); // reset current transformation matrix to the identity matrix
            wheelLife.ctx.translate(wheelLife.width / 2, wheelLife.height / 2);
			wheelLife.ctx.textAlign = "left";
			
			log('---------------------');
            for (i = 0; i < wheelLife.areas.length; i++) {

                gradBegin = i * wheelLife.areaGradWidth + wheelLife.areaGradWidth / 2 - 90;
				
                /*if (gradBegin < 90) {
                    wheelLife.ctx.textAlign = "left";
                } else {
                    wheelLife.ctx.textAlign = "right";
                }
                if (gradBegin > 80 && gradBegin < 120) wheelLife.ctx.textAlign = "center";*/
				
				var xImg = Math.cos(gradBegin * Math.PI / 180) * (wheelLife.circleRadius+65)-50;
				var yImg = Math.sin(gradBegin * Math.PI / 180) * (wheelLife.circleRadius+65)-50;
				var xArc = Math.cos(gradBegin * Math.PI / 180) * (wheelLife.circleRadius+65);
				var yArc = Math.sin(gradBegin * Math.PI / 180) * (wheelLife.circleRadius+65);
				
                /*wheelLife.ctx.fillStyle = '#' + wheelLife.areas[i][2];
                wheelLife.ctx.fillText(wheelLife.areas[i][0].substr(0, 30), Math.cos(gradBegin * Math.PI / 180) * (wheelLife.circleRadius + textMargin), Math.sin(gradBegin * Math.PI / 180) * (wheelLife.circleRadius + textMargin));
				*/
				
				wheelLife.ctx.save();
				wheelLife.ctx.beginPath();
				wheelLife.ctx.arc(xArc, yArc, 50, 0, Math.PI * 2, true);
				wheelLife.ctx.lineWidth = 3;
				wheelLife.ctx.strokeStyle = '#' + wheelLife.areas[i][2];
				wheelLife.ctx.stroke();
				wheelLife.ctx.fillStyle = '#' + wheelLife.areas[i][2];
				wheelLife.ctx.fill();
				wheelLife.ctx.closePath();
				wheelLife.ctx.clip();

				base_image = new Image();
				base_image.src = areas[i][1];
				wheelLife.ctx.drawImage(base_image, xImg, yImg, 100, 100);
				
				wheelLife.ctx.restore();
				
				////////////////////////////////////////////////////////
                
				areaLevel = wheelLife.areas[i][3];
                if (areaLevel < 11) {
                    if (areaLevel > 10) areaLevel = 10;
                    wheelLife.ctx.save();
                    wheelLife.ctx.fillStyle = '#fff';
                    wheelLife.ctx.font = '12px verdana';
                    wheelLife.ctx.globalAlpha = 0.25;
                    wheelLife.ctx.shadowColor = "rgba( 0, 0, 0, 0 )";
                    var textAreaLevel = areaLevel - 1;
                    if (textAreaLevel < 2) textAreaLevel = areaLevel + 1;
                    wheelLife.ctx.fillText(areaLevel, Math.cos(gradBegin * Math.PI / 180) * (textAreaLevel * wheelLife.areaLevelWidth), Math.sin(gradBegin * Math.PI / 180) * (textAreaLevel * wheelLife.areaLevelWidth));
                    wheelLife.ctx.restore();
                }
            }

            wheelLife.ctx.restore();

            /*if (countAreaClicked == wheelLife.areas.length && ! wheelLife.isDrawSimple) {
                // Рисуем дату и логотип, только после завершения выбора сфер

                if (wheelLife.scaleCoef == 2) {
                    // Не выводим на мелких экранах
                    // Draw logo (resized for better quality) & site name
                    var domain = 'Goal-Life.com';
                    wheelLife.ctx.font = '12pt verdana';
                    wheelLife.ctx.textAlign = "right";
                    wheelLife.ctx.fillStyle = '#999';
                    wheelLife.ctx.fillText(domain, wheelLife.width - 13, wheelLife.height - 13);
                    // logo
                    wheelLife.ctx.drawImage(wheelLife.images['logo'], wheelLife.width - wheelLife.ctx.measureText(domain).width - 38, wheelLife.height - 29, wheelLife.images['logo'].width / 2.5, wheelLife.images['logo'].height / 2.5);
                }

                // Draw date
                wheelLife.ctx.textAlign = "left";
                wheelLife.ctx.font = '10px verdana';
                wheelLife.ctx.fillStyle = '#ccc';
                wheelLife.ctx.fillText(wheelLife.todayStr, 13, wheelLife.height - 13);
            } else {
                // Draw demo pointer
                if (wheelLife.demoFrameNum > 0) {
                    wheelLife.ctx.drawImage(wheelLife.images['pointer'], e.offsetX, e.offsetY);
                }
            }*/

            if (currentArea > 0) {
//            $("#log2").text("Сфера: " + currentArea + '; ' + wheelLife.currentAreaLevel);
                $(wheelLife.canvas).css('cursor', 'pointer');
            } else {
//            $("#log2").text("Сфера: вне круга");
                $(wheelLife.canvas).css('cursor', 'default');
            }

            $('#log').html();

            // Все сферы выбраны - показываем результат
            if (countAreaClicked == wheelLife.areas.length && e.type == 'click') {
                wheelLife.result();
            }

        },
        isMouseInThatSector: function (gradBegin, x, y, area) {
            // Начало сектора - в самом верху
            gradBegin += 90;
            // Конец сектора
            var gradEnd = Math.round(gradBegin + wheelLife.areaGradWidth);
            // Текущий радиус круга, на котором находится курсор
            var currentRadius = Math.sqrt(Math.pow(x - 0, 2) + Math.pow(y - 0, 2));
            // Текущий угол в котором находится курсор
            var currentGrad = Math.round(Math.asin(x / currentRadius) / Math.PI * 180);

            // Поправки на 0-360 градусов
            if (y < 0 && x > 0) currentGrad = 180 - currentGrad;
            if (y < 0 && x < 0) currentGrad = 180 - currentGrad;
            if (x < 0 && y > 0) currentGrad = 360 + currentGrad;
            if (gradBegin < 0 && x < 0 && y > 0) currentGrad = currentGrad - 360; // Когда первая сфера смещена против часовой. Для звезды Ковалёва.

            // Курсор не попадает в текущий сектор или радиус мышки больше чем круг
            if (currentGrad < gradBegin || currentGrad >= gradEnd || currentRadius > wheelLife.circleRadius) {
                return false;
            }

            wheelLife.currentAreaLevel = 10 - Math.floor((wheelLife.circleRadius - currentRadius) / wheelLife.areaLevelWidth);
            if (wheelLife.currentAreaLevel == 0) wheelLife.currentAreaLevel = 1;

            return true;
        },
        downloadImage: function () {
            var dataURL = wheelLife.canvas.toDataURL();

            var link = document.createElement('a');
            link.download = 'wheel-life-' + wheelLife.todayStr.replace(/\./, '-').replace(/\./, '-') + '.png';
            link.href = dataURL;
            link.click();

            return false;
        },
        saveImage: function () {
            var dataURL = wheelLife.canvas.toDataURL();

            $.post('/tool/wheel_life_save',
                {image_data: dataURL},
                function () {
                    $('#wheel-life-result .share .text-on span').hide();
                }
            );
        },
        demo: function () {
            if (wheelLife.demoFramesInterval) {
                // already play demo -- если окно потеряет фокус, то браузер начнет быстро прорисовывать аннимацию накладывая несколько
                return false;
            }
            wheelLife.demoFrameNum = 0;
            wheelLife.demoFramesInterval = setInterval(wheelLife.demoFrame, 30);
        },
        demoFrame: function () {
            wheelLife.demoFrameNum += 1;
            var frame = wheelLife.demoFrameNum;
            if (frame > 30) frame = 61 - wheelLife.demoFrameNum;
            wheelLife.onMouseMove({
                offsetX: wheelLife.width / 2 + 30 + frame * 3,
                offsetY: wheelLife.height / 2 + (wheelLife.demoFrameNum > 30 ? 20 : -20),
                type: 'demo'
            }); // Simulate click

            if (wheelLife.demoFrameNum > 60) {
                clearInterval(wheelLife.demoFramesInterval);
                wheelLife.demoFramesInterval = null;
                wheelLife.onMouseMove({offsetX: -20, offsetY: -20, type: 'demo'}); // Simulate click
            }
        },
        result: function () {
            //localEvent('wheel-life', 'result', 'show', 1, 1);

            $('#wheel-life-result').show();
            $('#wheel-life-result .result').show();
            $('#button-download-wheel').show();
            $('#button-clear-areas').show();

            // Сильные и слабые сферы
            var max = 0, min = 10;
            var good = [], bad = [];

            for (var i = 0; i < wheelLife.areas.length; i++) {
                if (min > wheelLife.areas[i][3]) min = wheelLife.areas[i][2];
                if (max < wheelLife.areas[i][3]) max = wheelLife.areas[i][2];
            }

            for (i = 0; i < wheelLife.areas.length; i++) {
                if (wheelLife.areas[i][3] == min || wheelLife.areas[i][3] == min) bad.push(wheelLife.areas[i][0]);
                if (wheelLife.areas[i][3] == max || wheelLife.areas[i][3] == max - 1) good.push(wheelLife.areas[i][0]);
            }

            $('#areas-good').html(good.join(', '));
            if (min == max || min + 1 == max) {
                bad = ['Всё ровненько :)'];
                $('#recommendation-for-bad').hide();
            }
            $('#areas-bad').html(bad.join(', '));

            return false;
        }
    };

    wheelLife.isDrawSimple = settings['isDrawSimple'];
    wheelLife.areas = settings['areas'];

    return wheelLife;
}