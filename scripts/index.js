'use strict';

//выпадающие списки
const optionBtnOrder = document.querySelector('.option__btn_order'),
    optionBtnPeriod = document.querySelector('.option__btn_period'),
    optionListOrder = document.querySelector('.option__list_order'),
    optionListPeriod = document.querySelector('.option__list_period'),
    headerFound = document.querySelector('.found');

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
    }
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

//вывод карточек и поиск
const convertDate = (dateString = '') => {    
    const patternDate  = /(\d{2})\/(\d{2})\/(\d{4})/gm;
    let withGyhepns, withDots;
    withGyhepns = dateString ? dateString.replace(patternDate, '$3-$1-$2') : '';
    withDots  = dateString ? dateString.replace(patternDate, '$2.$1.$3') : '';
    console.log(dateString, withGyhepns, withDots);
    return {withGyhepns, withDots};    
}

const createCard = (vacancy) => {
    const {id,
        title,
        minCompensation,
        compensation,
        workSchedule,
        employer,
        address,
        description,
        date        
    } = vacancy;
    const convertedDate = convertDate(date); 
    const card = document.createElement('li');
    card.classList.add('result__item');
    const cardElement = 
    `    
        <article class="vacancy">
        <h2 class="vacancy__title">
            <a class="vacancy__open-modal" href="#" data-vacancy="${id}">${title}</a>
        </h2>
        <p class="vacancy__compensation">${compensation}</p>
        <p class="vacancy__work-schedule">${workSchedule}</p>
        <div class="vacancy__employer">
            <p class="vacancy__employer-title">${employer}</p>
            <p class="vacancy__employer-address">${address}</p>
        </div>
        <p class="vacancy__description">${description}</p>
        <p class="vacancy__date">
            <time datetime="${convertedDate.withGyhepns}">${convertedDate.withDots}</time>
        </p>
        <div class="vacancy__wrapper-btn">
            <a class="vacancy__response vacancy__open-modal" href="#" data-vacancy="${id}">Откликнуться</a>
            <button class="vacancy__contacts">Показать контакты</button>
        </div>
        </article>
    `;
    card.insertAdjacentHTML('afterbegin', cardElement);
    return card;
};

const renderCards = (data = ['']) => {
    resultList.textContent = '';
    /*const cards = [];
    data.forEach(element => {
        resultList.append(createCard(element));
    });*/
    const cards = data.map(createCard);
    resultList.append(...cards);

};

const BASE_URL = 'http://localhost:3000';
const urlApiGetVacancy = new URL('api/vacancy', BASE_URL);

const getData = ({search} = {}) => {
    if (search) {
        urlApiGetVacancy.searchParams.delete('search');
        urlApiGetVacancy.searchParams.append('search', search);
        return fetch(urlApiGetVacancy);
    }
    return fetch(urlApiGetVacancy);
}

const formSearch = document.querySelector('.bottom__search');

formSearch.addEventListener('submit', async (e) => {
    e.preventDefault();
    const textSearch = formSearch.search.value;
    if (textSearch.length > 2) {
        formSearch.search.style.borderColor = '';
        const data = await getData({search: textSearch})
        .then(response => {
            if(response.ok){
                return response.json();
            } 
            throw new Error('Something went wrong');
        })
        .then(data => {
            return data;
        })    
        .catch((error) => {
            console.warn(error);
        });
        renderCards(data);
        formSearch.reset();
        clearHeaderFound();
        const headerFoundContent = `
        ${data.length} ${declOfNum(data.length, ['вакансия', 'вакансии', 'вакансий'])} &laquo;<span class="found__item">${textSearch}</span>&raquo;
        `;
        headerFound.insertAdjacentHTML('beforeend', headerFoundContent);

    } else {
        formSearch.search.style.borderColor = 'red';
        setTimeout(()=>{
            formSearch.search.style.borderColor = '';
        }, 2000);
    }
});

const init = async () => {
    const data = await getData()
    .then(response => {
        if(response.ok){
            return response.json();
        } 
        throw new Error('Error fetching data');
    })
    .then(data => {
        return data;
    })    
    .catch((error) => {
        console.warn(error);
    });
    renderCards(data);        
        
};

const clearHeaderFound = () => {
    headerFound.textContent = '';
};

function declOfNum(number, words) {  
    return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? Math.abs(number) % 10 : 5]];
} 

clearHeaderFound();
init();

renderCards();