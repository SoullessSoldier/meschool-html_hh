'use strict';

//выпадающие списки
const optionBtnOrder = document.querySelector('.option__btn_order'),
    optionBtnPeriod = document.querySelector('.option__btn_period'),
    optionListOrder = document.querySelector('.option__list_order'),
    optionListPeriod = document.querySelector('.option__list_period'),
    headerFound = document.querySelector('.found');

const topCityBtn = document.querySelector('.top__city'),
    city = document.querySelector('.city'),
    cityCloseBtn = document.querySelector('.city__close'),
    cityRegionList = document.querySelector('.city__region-list');

const overlayVacancyModal = document.querySelector('.overlay_vacancy'),
    resultList = document.querySelector('.result__list');

const formSearch = document.querySelector('.bottom__search');

const BASE_URL = 'http://localhost:3000';
const urlApiGetVacancy = new URL('api/vacancy', BASE_URL);

const orderBy = document.querySelector('#order_by');
const searchPeriod = document.querySelector('#search_period');

let data = [];

const createUrlApiGetVacancyById = (id = '') => {
    let res ;
    if (id) {
        res = new URL(`api/vacancy/${id}`, BASE_URL);
    } else {
        res = urlApiGetVacancy;
    }
    return res;
};

const convertDate = (dateString = '') => {    
    const patternDate  = /(\d{2})\/(\d{2})\/(\d{4})/gm;
    let withGyhepns, withDots;
    withGyhepns = dateString ? dateString.replace(patternDate, '$3-$1-$2') : '';
    withDots  = dateString ? dateString.replace(patternDate, '$2.$1.$3') : '';
    return {withGyhepns, withDots};    
};

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

const urlAddSearchParameter = (url, parameter, value) => {    
    for (let item of url.searchParams.keys()){        
        url.searchParams.delete(item);
    } 
    if(parameter){
        url.searchParams.delete(parameter);
        url.searchParams.append(parameter, value);
    }    
    return url;    
};

const sortData = () => {
    switch(orderBy.value){
        case 'down':
            data.sort((a, b) => a.minCompensation > b.minCompensation ? 1 : -1);
            break;
        case 'up':
            data.sort((a, b) => b.minCompensation > a.minCompensation ? 1 : -1);
            break;
        default:
            data.sort((a, b) => new Date(b.date).getTime() > new Date(a.date).getTime() ? 1 : -1);
    }
};

const filterData = () => {    
    const date = new Date();
    date.setDate(date.getDate() - searchPeriod.value);
    return data.filter(item => new Date(item.date).getTime() > date); 
};

const getData = ({search, id, country, city} = {}) => {
    if (search) {        
        return fetch(urlAddSearchParameter(urlApiGetVacancy, 'search', search));
    }
    if (id) {
        const url = createUrlApiGetVacancyById(id);            
        return fetch(url);
    } 
    if (country){
        return fetch(urlAddSearchParameter(urlApiGetVacancy, 'country', country));
    }
    if (city){
        return fetch(urlAddSearchParameter(urlApiGetVacancy, 'city', city));
    }
    return fetch(urlApiGetVacancy);
};

const handlerOptions = () => {
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
            orderBy.value = target.dataset.sort;
            sortData();
            renderCards(data);
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
            searchPeriod.value = target.dataset.date;
            const tempData = filterData();
            renderCards(tempData);
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
};

const handlerCity = () => {
    topCityBtn.addEventListener('click', () => {
        city.classList.toggle('city_active');
    });
    
    cityCloseBtn.addEventListener('click', () => {
        city.classList.remove('city_active');
    });
    
    cityRegionList.addEventListener('click', async (e) => {
        const target = e.target;
        if(target.classList.contains('city__link')){
            const hash = new URL(target.href).hash.substring(1);
            const option = {
                [hash]: target.textContent
            };
            data = await getData(option)
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
            sortData();
            data = filterData();
            renderCards(data);
            topCityBtn.textContent = target.textContent;
            city.classList.remove('city_active');
        }
    });
};

const createModal = (data) => {
    const {        
        title,
        compensation,
        employer,
        address,
        experience,
        description,
        employment,
        skills
    } = data;
    const modal = document.createElement('div');
    let skillsList = '';
    modal.classList.add('modal');
    for (let item of skills) {
        skillsList += `<li class="skills__item">${item}</li>\n`;
    }
    const modalContent = `
    <button class="modal__close">✕</button>
    <h3 class="modal__title">${title}</h3>
    <p class="modal__compensation">${compensation}</p>
    <p class="modal__employer">${employer}</p>
    <p class="modal__address">${address}</p>
    <p class="modal__experience">Требуемый опыт работы: ${experience}</p>
    <p class="modal__employment">${employment.join(',')}</p>
    <p class="modal__description">${description}</p>
    <div class="modal__skills skills">
      <h2 class="skills__title">Подробнее:</h2>
      <ul class="skills__list">${skillsList}         
      </ul>
    </div>

    <button class="modal__response">Отправить резюме</button>
    `;
    modal.insertAdjacentHTML('beforeend', modalContent);
    return modal;
};

const handlerModal = () => {
    resultList.addEventListener('click', async (e) => {    
        const target = e.target;
        if(target.dataset.vacancy){
            e.preventDefault();
            overlayVacancyModal.classList.add('overlay_active');
            overlayVacancyModal.textContent = '';
            const data = await getData({id: target.dataset.vacancy})
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
            const modal = createModal(data);
            overlayVacancyModal.append(modal);
        }
    });
    
    overlayVacancyModal.addEventListener('click', (e) => {
        const target = e.target;
        if (target === overlayVacancyModal || target.classList.contains('modal__close')){
            overlayVacancyModal.classList.remove('overlay_active');
        }
    });
};

const handlerSearch = () => {
    formSearch.addEventListener('submit', async (e) => {
        e.preventDefault();
        const textSearch = formSearch.search.value;
        if (textSearch.length > 2) {
            formSearch.search.style.borderColor = '';
            data = await getData({search: textSearch})
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
            sortData();
            data = filterData();
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
};

const init = async () => {
    data = await getData()
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
    sortData();
    data = filterData();
    renderCards(data);
    
    handlerOptions();
    
    handlerCity();
    
    handlerModal();    
    
    handlerSearch();
        
};

const clearHeaderFound = (word = '') => {
    headerFound.textContent = word;
};

const declOfNum = (number, words) => {  
    return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? Math.abs(number) % 10 : 5]];
}; 

clearHeaderFound('Последние вакансии');
init();


renderCards();