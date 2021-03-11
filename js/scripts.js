document.addEventListener("DOMContentLoaded", function() {

    // ФУНКЦИЯ ДОБАВЛЯЕТ КАРТИНКУ img, КОТОРАЯ СТОИТ В БЛОКЕ С КЛАССОМ ibg,
    // В ВИДЕ ФОНА background
    function ibg() {
        let ibg = document.querySelectorAll(".ibg");
        for (var i = 0; i < ibg.length; i++) {
            if (ibg[i].querySelector('img')) {
                ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
            }
        };
    }

    ibg();

    // СЭНДВИЧ-МЕНЮ
    let iconMenu = document.querySelector(".icon_menu");
    let menuBody = document.querySelector(".menu_body");
    let headerLogo = document.querySelector(".header_logo");
    let arrow = document.querySelector(".arrow_top");
    let body = document.querySelector("body");
    let menuLink = document.getElementsByClassName("menu_link");

    function sandwichClick() {
        iconMenu.classList.toggle("active");
        menuBody.classList.toggle("active");
        headerLogo.classList.toggle("active");
        arrow.classList.toggle("active");
        body.classList.toggle("lock");
    };

    iconMenu.addEventListener('click', function() {
        sandwichClick();
    });

    for (var i = 0; i < menuLink.length; i++) {
        menuLink[i].addEventListener('click', function() {
            sandwichClick();
        });
    };



    // АККОРДЕОН ДЛЯ ОТКРЫТИЯ И ЗАКРЫТИЯ БЛОКОВ
    let itemLink = document.getElementsByClassName("item_link");
    let trainingContent = document.getElementsByClassName("training_content");

    for (var i = 0; i < itemLink.length; i++) {
        itemLink[i].addEventListener('click', function() {
            var index = Array.prototype.indexOf.call(itemLink, this);
            trainingContent[index].classList.toggle('open');
        });
    };

    // СТРЕЛКА НАВЕРХ
    let goTopBtn = document.getElementById('arrow_top');

    function backToTop() {
        if (window.pageYOffset > 0) {
            window.scrollBy(0, -2000);
            setTimeout(backToTop, 0);
        }
    };

    goTopBtn.onclick = function() {
        backToTop();
    };

    // СЛАЙДЕР
    let slideShow = (function() {
        return function(selector, config) {
            let
                slider = document.querySelector(selector), // основный элемент блока
                sliderContainer = slider.querySelector('.slider_items'), // контейнер для .slider-item
                sliderItems = slider.querySelectorAll('.slider_item'), // коллекция .slider-item
                sliderControls = slider.querySelectorAll('.slider_control'), // элементы управления
                currentPosition = 0, // позиция левого активного элемента
                transformValue = 0, // значение транфсофрмации .slider_wrapper
                transformStep = 100, // величина шага (для трансформации)
                itemsArray = [], // массив элементов
                timerId,
                indicatorItems,
                indicatorIndex = 0,
                indicatorIndexMax = sliderItems.length - 1,
                configs = {
                    isAutoplay: false, // автоматическая смена слайдов
                    directionAutoplay: 'next', // направление смены слайдов
                    delayAutoplay: 5000, // интервал между автоматической сменой слайдов
                    isPauseOnHover: true // устанавливать ли паузу при поднесении курсора к слайдеру
                };

            // настройка конфигурации слайдера в зависимости от полученных ключей
            for (var key in config) {
                if (key in configs) {
                    configs[key] = config[key];
                }
            }

            // наполнение массива itemsArray
            for (var i = 0; i < sliderItems.length; i++) {
                itemsArray.push({ item: sliderItems[i], position: i, transform: 0 });
            }

            // переменная position содержит методы с помощью которой можно получить минимальный и максимальный индекс элемента, а также соответствующему этому индексу позицию
            let position = {
                getItemIndex: function(mode) {
                    var index = 0;
                    for (var i = 0; i < itemsArray.length; i++) {
                        if ((itemsArray[i].position < itemsArray[index].position && mode === 'min') || (itemsArray[i].position > itemsArray[index].position && mode === 'max')) {
                            index = i;
                        }
                    }
                    return index;
                },
                getItemPosition: function(mode) {
                    return itemsArray[position.getItemIndex(mode)].position;
                }
            };

            // функция, выполняющая смену слайда в указанном направлении
            let move = function(direction) {
                var nextItem, currentIndicator = indicatorIndex;;
                if (direction === 'next') {
                    currentPosition++;
                    if (currentPosition > position.getItemPosition('max')) {
                        nextItem = position.getItemIndex('min');
                        itemsArray[nextItem].position = position.getItemPosition('max') + 1;
                        itemsArray[nextItem].transform += itemsArray.length * 100;
                        itemsArray[nextItem].item.style.transform = 'translateX(' + itemsArray[nextItem].transform + '%)';
                    }
                    transformValue -= transformStep;
                    indicatorIndex = indicatorIndex + 1;
                    if (indicatorIndex > indicatorIndexMax) {
                        indicatorIndex = 0;
                    }
                } else {
                    currentPosition--;
                    if (currentPosition < position.getItemPosition('min')) {
                        nextItem = position.getItemIndex('max');
                        itemsArray[nextItem].position = position.getItemPosition('min') - 1;
                        itemsArray[nextItem].transform -= itemsArray.length * 100;
                        itemsArray[nextItem].item.style.transform = 'translateX(' + itemsArray[nextItem].transform + '%)';
                    }
                    transformValue += transformStep;
                    indicatorIndex = indicatorIndex - 1;
                    if (indicatorIndex < 0) {
                        indicatorIndex = indicatorIndexMax;
                    }
                }
                sliderContainer.style.transform = 'translateX(' + transformValue + '%)';
                indicatorItems[currentIndicator].classList.remove('active');
                indicatorItems[indicatorIndex].classList.add('active');
            };

            // функция, осуществляющая переход к слайду по его порядковому номеру
            var moveTo = function(index) {
                var i = 0,
                    direction = (index > indicatorIndex) ? 'next' : 'prev';
                while (index !== indicatorIndex && i <= indicatorIndexMax) {
                    move(direction);
                    i++;
                }
            };

            // функция для запуска автоматической смены слайдов через промежутки времени
            var startAutoplay = function() {
                if (!configs.isAutoplay) {
                    return;
                }
                stopAutoplay();
                timerId = setInterval(function() {
                    move(configs.directionAutoplay);
                }, configs.delayAutoplay);
            };

            // функция, отключающая автоматическую смену слайдов
            var stopAutoplay = function() {
                clearInterval(timerId);
            };

            // функция, добавляющая индикаторы к слайдеру
            var addIndicators = function() {
                var indicatorsContainer = document.createElement('ol');
                indicatorsContainer.classList.add('slider_indicators');
                for (var i = 0; i < sliderItems.length; i++) {
                    var sliderIndicatorsItem = document.createElement('li');
                    if (i === 0) {
                        sliderIndicatorsItem.classList.add('active');
                    }
                    sliderIndicatorsItem.setAttribute("data-slide-to", i);
                    indicatorsContainer.appendChild(sliderIndicatorsItem);
                }
                slider.appendChild(indicatorsContainer);
                indicatorItems = slider.querySelectorAll('.slider_indicators > li')
            };

            // функция, осуществляющая установку обработчиков для событий 
            var setUpListeners = function() {
                slider.addEventListener('click', function(e) {
                    if (e.target.classList.contains('slider_control')) {
                        e.preventDefault();
                        move(e.target.classList.contains('slider_control_next') ? 'next' : 'prev');
                        startAutoplay();
                    } else if (e.target.getAttribute('data-slide-to')) {
                        e.preventDefault();
                        moveTo(parseInt(e.target.getAttribute('data-slide-to')));
                        startAutoplay();
                    }
                });
                document.addEventListener('visibilitychange', function() {
                    if (document.visibilityState === "hidden") {
                        stopAutoplay();
                    } else {
                        startAutoplay();
                    }
                }, false);
            };

            // добавляем индикаторы к слайдеру
            addIndicators();
            // установливаем обработчики для событий
            setUpListeners();
            // запускаем автоматическую смену слайдов, если установлен соответствующий ключ
            startAutoplay();

            return {
                // метод слайдера для перехода к следующему слайду
                next: function() {
                    move('next');
                },
                // метод слайдера для перехода к предыдущему слайду          
                left: function() {
                    move('prev');
                },
                // метод отключающий автоматическую смену слайдов
                stop: function() {
                    configs.isAutoplay = false;
                    stopAutoplay();
                },
                // метод запускающий автоматическую смену слайдов
                cycle: function() {
                    configs.isAutoplay = true;
                    startAutoplay();
                }
            }
        }
    }());

    slideShow('.slider', {
        isAutoplay: true
    });

    // /*Пролистываем слайдер стрелками на клавиатуре*/
    // document.onkeydown = checkKey;
    // function checkKey(e){
    //   e = e || window.event;
    //     if(e.keyCode == '37'){
    //       minusSlide();
    //     }
    //     else if(e.keyCode == '39'){
    //       plusSlide();
    //     }
    // };

    // /*Swipe слайдера*/
    // let sliderBlock = document.getElementById('slider_wrapper');

    // sliderBlock.addEventListener('touchstart', handleTouchStart, false);  
    // sliderBlock.addEventListener('touchmove', handleTouchMove, false);

    // let xDown = null;                                                        
    // let yDown = null;                                                        

    // function handleTouchStart(evt) {                                         
    //     xDown = evt.touches[0].clientX;                                      
    //     yDown = evt.touches[0].clientY;                                      
    // };                                                

    // function handleTouchMove(evt) {
    //     if ( ! xDown || ! yDown ) {
    //         return;
    //     }

    //     var xUp = evt.touches[0].clientX;                                    
    //     var yUp = evt.touches[0].clientY;

    //     var xDiff = xDown - xUp;
    //     var yDiff = yDown - yUp;
    //     if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
    //         if ( xDiff > 0 ) {
    //           plusSlide();
    //         } else {
    //           minusSlide();
    //         }                       
    //     }
    //     xDown = null;
    //     yDown = null;                                             
    // };



});