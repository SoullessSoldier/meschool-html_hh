'use strict';

//выпадающие списки
const optionBtnOrder = document.querySelector('.option__btn_order'),
    optionBtnPeriod = document.querySelector('.option__btn_period'),
    optionListOrder = document.querySelector('.option__list_order'),
    optionListPeriod = document.querySelector('.option__list_period');

optionBtnOrder.addEventListener('click', (e) => {
    optionListOrder.classList.toggle('option__list_active');
    optionListPeriod.classList.remove('option__list_active');
});

optionBtnPeriod.addEventListener('click', (e) => {
    optionListPeriod.classList.toggle('option__list_active');
    optionListOrder.classList.remove('option__list_active');
});

optionListOrder.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('option__item')){
        optionBtnOrder.textContent = target.textContent;
        for (const elem of optionListOrder.querySelectorAll('.option__item')){
            if (elem === target){
                elem.classList.add('option__item_active');
            } else {
                elem.classList.remove('option__item_active');
            }
        }        
    }
    optionListOrder.classList.remove('option__list_active');
});

optionListPeriod.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('option__item')){
        optionBtnPeriod.textContent = target.textContent;
        for (const elem of optionListPeriod.querySelectorAll('.option__item')){
            if (elem === target){
                elem.classList.add('option__item_active');
            } else {
                elem.classList.remove('option__item_active');
            }
        }        
    }
    optionListPeriod.classList.remove('option__list_active');
});

//выбор города
const topCityBtn = document.querySelector('.top__city'),
    city = document.querySelector('.city'),
    cityCloseBtn = document.querySelector('.city__close'),
    cityRegionList = document.querySelector('.city__region-list');

topCityBtn.addEventListener('click', () => {
    city.classList.toggle('city_active');
});

cityCloseBtn.addEventListener('click', () => {
    city.classList.remove('city_active');
});

cityRegionList.addEventListener('click', (e) => {
    const target = e.target;
    if(target.classList.contains('city__link')){
        topCityBtn.textContent = target.textContent;
        city.classList.remove('city_active');
    };
});

//модальное окно
const overlayVacancyModal = document.querySelector('.overlay_vacancy'),
    resultList = document.querySelector('.result__list');

resultList.addEventListener('click', (e) => {    
    const target = e.target;
    if(target.dataset.vacancy){
        e.preventDefault();
        overlayVacancyModal.classList.add('overlay_active');
    }
});

overlayVacancyModal.addEventListener('click', (e) => {
    const target = e.target;
    if (target === overlayVacancyModal || target.classList.contains('modal__close')){
        overlayVacancyModal.classList.remove('overlay_active');
    }
});

