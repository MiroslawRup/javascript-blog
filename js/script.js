{

  'use strict';

  /* STAŁE */
  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author',
    optCloudClassCount = 5,
    optCloudClassPrefix = 'cloud-size-';

  /* UTWORZENIE LISTY TYTUŁÓW POSTÓW (JAKO LISTA LINKÓW) NA PODSTAWIE ISTNIEJĄCYCH ARTYKUŁÓW W HTML */
  /* argument funkcji customSelector = '' jest wstawiony do wykorzystania przez inne funkcje tj. tagClickHandler i authorClickHandler czyli po kliknięciu linków tagu lub linku autora lista postów jest filtrowana */

  const generateTitleLinks = function(customSelector = '') {
    const titleList = document.querySelector(optTitleListSelector);   /* ustalenie miejsca w HTML zawierającego listę tytułów postów (jako lista linków) */
    titleList.innerHTML = '';   /* wykasowanie zawartości (dotychczasowej listy tytułów postów) */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);   /* wyszukanie i ustalenie zbioru artykułów zawartych w HTML */
    let html = '';   /* deklaracja zmiennej typu string - kod linków do wstawienie w HTML */
    for (let article of articles) {   /* pętla przez wszystkie artykuły (posty) */
      const articleID = article.getAttribute('id');   /* pobranie id postu */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;   /* pobranie tytułu postu */
      const linkHTML = '<li><a href="#' + articleID + '"><span>' + articleTitle + '</span></a></li>'; /* utworzenie linku danego postu w postaci HTML */
      html = html + linkHTML;   /* budowanie wszystkich linków listy tytułów postów w kolejnych krokach pętli */
    }
    titleList.innerHTML = html;   /* wstawienie listy linków (HTML) w odpowiednie miejsce */
  };

  /* DZIAŁANIE PO KLIKNIĘCIU USERA W LINK Z LISTY TYTŁÓW POSTÓW */
  /* kliknięty link ma być wyróżniony np. pogrubienie (CSS) oraz ma się wyświetlić treść tylko 1 artykułu odpowiednio do klikniętego linku */

  const addClickListenersToTitle = function() {

    const titleClickHandler = function(event) {
      event.preventDefault();   /* blokada wyświetlanie linku w adresie strony (estetyka) */
      const clickedElement = this;   /* ustalenie stałej jako kliknięty element */
      const activeLinks = document.querySelectorAll('.titles a.active');   /* wyszukanie i ustalenie zbioru aktywnych linków	(klasa "active") na liscie tytułów postów */
      for (let activeLink of activeLinks) {
        activeLink.classList.remove('active');   /* usunięcie klasy "active" z wszystkich linków na liście tytułów postów */
      }
      clickedElement.classList.add('active');   /* dodadnie klasy "active" do klikniętego linka (powoduje np. pogrubienie) */
      const activeArticles = document.querySelectorAll('.posts article.active');   /* wyszukanie i ustalenie zbioru aktywnych artykułów (klasa "active") */
      for (let activeArticle of activeArticles) {
        activeArticle.classList.remove('active');   /* usunięcie klasy "active" z wszystkich artykułów */
      }
      const articleSelector = clickedElement.getAttribute('href');   /* pobranie adresu do artukułu (href) z kilkniętego linka na liscie tytułów postów */
      const targetArticle = document.querySelector(articleSelector);   /* wyszukanie i ustalenie artykułu zawierającego selektor (id) jak w adresie (href) klikniętego linku */
      targetArticle.classList.add('active');   /* dodanie klasy "active" do wyszukanego artykułu (co spowoduje jego wyświetlenie) */
    };

    const links = document.querySelectorAll('.titles a');   /* wyszukanie i ustalenie zbioru wszystkich utworzonych linków (lista tytułów postów) */
    for (let link of links) {
      link.addEventListener('click', titleClickHandler);   /* dodanie nasłuchiwacza kliknięć usera w link) */
    }
  };

  /* funkcja do obliczenia min i max ilości wystąpień elementu */

  const calculateParams = function(inputObjects) {   /* funkcja do obliczenia min i max ilości wystąpień elementu */
    const params = {
      min: 999999,   /* ustalenie skrajnej wartości początkowej klucza obiektu params.min */
      max: 0,        /* ustalenie skrajnej wartości początkowej klucza obiektu params.max */
    };
    for (let inputObject in inputObjects) {   /* pętla po wszystkich elementach obiektu ich liczbę wystąpień */
      if (inputObjects[inputObject] > params.max) {   /* ustalenie maksimum */
        params.max = inputObjects[inputObject];
      }
      if (inputObjects[inputObject] < params.min) {   /* ustalenie minimum */
        params.min = inputObjects[inputObject];
      }
    }
    return params;
  };

  /* funkcja ustalająca klasy wysokosci czcionki w chmurze: count - liczby wystąpień danego elementu, params - min i max liczba wystapień wszystkich elementów */

  const calculateClass = function(count, params) {
    const classNumber = Math.floor(((count - params.min)/(params.max - params.min))*(optCloudClassCount - 1) + 1);   /* wzór obliczajacy klasy wysokosci czcionki w zależności od: przyjętej ilości klas, min i max. ilosci elementów oraz ilości wystapień */
    return classNumber;
  };

  /* UTWORZENIE TAGÓW POD KAŻYM POSTEM NA PODSTAWIE HTML ORAZ W CHMURZE TAGÓW (SUMARYCZNE)*/

  const generateTags = function() {

    let allTags = {};   /* deklaracja obiektu zawierajacego tagi jako klucze obiektu i wartosci jako liczbę wystapień tagu na całej stronie */
    const articles = document.querySelectorAll(optArticleSelector);   /* wyszukanie i ustalenie zbioru artykułów (postów) zawartych w HTML */
    for (let article of articles) {   /* pętla przez wszystkie artykuły (posty) */
      const tagsWrapper = article.querySelector(optArticleTagsSelector);   /* ustalenie miejsca w HTML na tagi pod każdym artykułem (postem) */
      let html = '';   /* deklaracja zmiennej typu string na kod html */
      const articleTags = article.getAttribute('data-tags');   /* pobranie tagów z HTML (odzielone spacją) */
      const articleTagsArray = articleTags.split(' ');   /* utworzenie tablicy tagów - z pozbyciem się spacji */
      for (let tag of articleTagsArray) {   /* pętla po tablicy tagów danego artykułu */
        const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';   /* utworzenie kodu HTML z danym tagiem */
        html = html + linkHTML;   /* dodanie kodu tagu do kodu zbioru tagów w danym artykule */
        if (!allTags[tag]) {   /* sprawdzanie czy w obiekcie jest już dany tag jako klucz obiektu */
          allTags[tag] = 1;   /* jeżeli nie było nadaje temu kluczowi taga wartość 1 */
        } else {
          allTags[tag]++;   /* jeżeli obiekt już miał taki klucz (tag) to zwiększa jego wartosć o 1 */
        }
      }
      tagsWrapper.innerHTML = html;   /* wstawienie wygenerowanego kodu HTML na końcu artykułu/postu */
    }
    const tagsParams = calculateParams(allTags);   /* wywołanie funkcji do obliczenia minimalnej i maksymalnej liczby wystąpień tagów */
    let allTagsHTML = '';   /* deklaracja zmiennej typu string  */
    for (let tag in allTags) {     /* pętla na obiekcie zawierajacym tagi i ich liczbę wystąpień */
      const tagLinkHTML = '<li><a class="' + optCloudClassPrefix + calculateClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">' + tag + '</a></li>';   /* tworzenie kodu HTML danego tagu do chmury tagów (z wywołaniem funkcji ustaljącej klasy wysokosci czcionki w chmurze) */
      allTagsHTML += tagLinkHTML;   /* budowanie całego kodu HTML chmury tagów */
    }
    const tagList = document.querySelector('.tags');   /* ustalenie miejsca w HTML na chmurę tagów */
    tagList.innerHTML = allTagsHTML;   /* wstawienie wygenerowanego kodu HTML do miejsca chmury tagów */
  };

  /* DZIAŁANIE PO KLIKNIĘCIU USERA W TAG POD ARTYKUŁEM */
  /* kliknięty link ma być wyróżniony np. pogrubienie (CSS) oraz ma się wyświetlić przefiltrowana (tylko te zawierające dany tag) */

  const addClickListenersToTags = function() {

    const tagClickHandler = function(event) {
      event.preventDefault();    /* blokada wyświetlanie linku w adresie strony (estetyka) */
      const clickedElement = this;     /* ustalenie stałej jako kliknięty element */
      const href = clickedElement.getAttribute('href');   /* pobranie atrybutu href z kilkniętego tagu */
      const tag = href.replace('#tag-', '');   /* usunięcie przedrostka tak aby pozostała sama treść taga */
      const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');   /* wyszukanie i ustalenie zbioru wszystkich tagów z klasą active */
      for (let activeTagLink of activeTagLinks) {
        activeTagLink.classList.remove('active');    /* usunięcie klasy "active" z wszystkich tagów */
      }
      const selectedTagLinks = document.querySelectorAll('a[href="' + href + '"]');   /* wyszukanie i ustalenie zbioru wszystkich tagów z href jak w klikniętym tagu */
      for (let selectedTagLink of selectedTagLinks) {
        selectedTagLink.classList.add('active');   /* dodanie klasy active do wszystkich tagów o href takim jak kliknięty tag */
      }
      generateTitleLinks('[data-tags~="' + tag + '"]');   /* wywołanie funkcji wyświetljącej listę linków tytułów postów ale tylko tych co zawierają kliknięty tag */
      addClickListenersToTitle();   /* uruchomienie listnera na linkach tytułów postów */
    };

    const linkTags = document.querySelectorAll('.post-tags a');   /* wyszukanie i ustalenie zbioru wszystkich utworzonych tagów (pod każdym postem) */
    for (let linkTag of linkTags) {
      linkTag.addEventListener('click', tagClickHandler);   /* dodanie nasłuchiwacza kliknięć usera w tag) */
    }

    const linkCloudTags = document.querySelectorAll('.sidebar .tags a');   /* wyszukanie i ustalenie zbioru wszystkich utworzonych tagów (pod każdym postem) */
    for (let linkCloudTag of linkCloudTags) {
      linkCloudTag.addEventListener('click', tagClickHandler);   /* dodanie nasłuchiwacza kliknięć usera w tag) */
    }

  };

  /* UTWORZENIE AUTORÓW POD KAŻYM TYTUŁEM W POŚCIE NA PODSTAWIE HTML ORAZ W CHMURZE AUTORÓW (SUMARYCZNE) */

  const generateAuthors = function() {   /* utworzenie autorów pod każdym tytułem artykułu oraz sumarycznie w chmurze tagów */
    let allAuthors = {};   /* deklaracja obiektu zawierajacego autorów jako klucze obiektu i wartosci jako liczbę artykułów autora na całej stronie */
    const articles = document.querySelectorAll(optArticleSelector);     /* wyszukanie i ustalenie zbioru artykułów (postów) zawartych w HTML */
    for (let article of articles) {    /* pętla przez wszystkie artykuły (posty) */
      const authorsWrapper = article.querySelector(optArticleAuthorSelector);   /* ustalenie miejsca w HTML na autora pod każdym tytułem artykułu (postem) */
      const articleAuthors = article.getAttribute('data-author');    /* pobranie danych o autorze z HTML */
      const html = '<a href="#author-' + articleAuthors + '">' + articleAuthors + '</a>';     /* utworzenie kodu HTML z danym autorem (link) */
      if (!allAuthors[articleAuthors]) {   /* sprawdzanie czy w obiekcie jest już dany autor jako klucz obiektu */
        allAuthors[articleAuthors] = 1;    /* jeżeli nie było nadaje temu kluczowi taga wartość 1 */
      } else {
        allAuthors[articleAuthors]++;   /* jeżeli obiekt już miał taki klucz (autora) to zwiększa jego wartosć o 1 */
      }
      authorsWrapper.innerHTML = html;   /* wstawienie wygenerowanego kodu HTML w odpowiednie miejsce */
    }

    const authorsParams = calculateParams(allAuthors);   /* wywołanie funkcji do obliczenia minimalnej i maksymalnej liczby wystąpień autorów */
    let allAuthorsHTML = '';   /* deklaracja zmiennej typu string  */
    for (let author in allAuthors) {     /* pętla na obiekcie zawierajacym autorów i ich liczbę wystąpień */
      const tagLinkHTML = '<li><a class="' + optCloudClassPrefix + calculateClass(allAuthors[author], authorsParams) + '" href="#author-' + author + '">' + author + '</a></li>';   /* tworzenie kodu HTML danego autora do chmury autorów (z wywołaniem funkcji ustaljącej klasy wysokosci czcionki w chmurze) */
      allAuthorsHTML += tagLinkHTML;   /* budowanie całego kodu HTML chmury autorów */
    }
    const authorList = document.querySelector('.authors');      /* ustalenie miejsca w HTML na chmurę autorów */
    authorList.innerHTML = allAuthorsHTML;   /* wstawienie wygenerowanego kodu HTML do miejsca chmury tagów */
  };

  /* DZIAŁANIE PO KLIKNIĘCIU USERA W AUTORA POD TYTUŁEM ARTYKUŁU */
  /* kliknięty link ma być wyróżniony np. pogrubienie (CSS) oraz ma się wyświetlić przefiltrowana (tylko te zawierające dany tag) */

  const addClickListenersToAuthors = function() {

    const authorClickHandler = function(event) {
      event.preventDefault();   /* blokada wyświetlanie linku w adresie strony (estetyka) */
      const clickedElement = this;    /* ustalenie stałej jako kliknięty element */
      console.log(clickedElement);
      const href = clickedElement.getAttribute('href');   /* pobranie atrybutu href z kilkniętego autora */
      const author = href.replace('#author-', '');   /* usunięcie przedrostka tak aby pozostała sama treść autora */
      const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');    /* wyszukanie i ustalenie zbioru wszystkich autorów z klasą active */
      for (let activeAuthorLink of activeAuthorLinks) {
        activeAuthorLink.classList.remove('active');     /* usunięcie klasy "active" z wszystkich autorów */
      }
      const selectedAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');   /* wyszukanie i ustalenie zbioru wszystkich autorów z href jak w klikniętym autorze */
      for (let selectedAuthorLink of selectedAuthorLinks) {
        selectedAuthorLink.classList.add('active');    /* dodanie klasy active do wszystkich autorów o href takim jak kliknięty autor */
      }
      generateTitleLinks('[data-author="' + author + '"]');   /* wywołanie funkcji wyświetlającej listę linków tytułów postów ale tylko tych co zawierają klikniętego autora */
      addClickListenersToTitle();    /* uruchomienie listnera na linkach tytułów postów */
    };

    const linkAuthors = document.querySelectorAll('.post-author a');   /* wyszukanie i ustalenie zbioru wszystkich utworzonych autorów (pod każdym tytułem postu) */
    for (let linkAuthor of linkAuthors) {
      linkAuthor.addEventListener('click', authorClickHandler);   /* dodanie nasłuchiwacza kliknięć usera w autora) */
    }

    const linkCloudAuthors = document.querySelectorAll('.sidebar .authors a');   /* wyszukanie i ustalenie zbioru wszystkich utworzonych autorów (pod każdym tytułem postu) */
    for (let linkCloudAuthor of linkCloudAuthors) {
      linkCloudAuthor.addEventListener('click', authorClickHandler);   /* dodanie nasłuchiwacza kliknięć usera w autora) */
    }
  };

  generateTitleLinks();          /* UTWORZENIE LISTY TYTUŁÓW POSTÓW (JAKO LISTA LINKÓW) NA PODSTAWIE ISTNIEJĄCYCH ARTYKUŁÓW W HTML */
  addClickListenersToTitle();    /* DZIAŁANIE PO KLIKNIĘCIU USERA W TYTŁÓW POSTU*/

  generateTags();                /* UTWORZENIE TAGÓW POD KAŻYM POSTEM NA PODSTAWIE HTML ORAZ W CHMURZE TAGÓW (SUMARYCZNE) */
  addClickListenersToTags();     /* DZIAŁANIE PO KLIKNIĘCIU USERA W TAG */

  generateAuthors();             /* UTWORZENIE AUTORÓW POD KAŻYM TYTUŁEM W POŚCIE NA PODSTAWIE HTML ORAZ W CHMURZE AUTORÓW (SUMARYCZNE) */
  addClickListenersToAuthors();  /* DZIAŁANIE PO KLIKNIĘCIU USERA W AUTORA */

}
