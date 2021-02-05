{
  'use strict';

  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;

    /* remove class 'active' from all article links	*/
    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }

    /* add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }

    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');

    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);

    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author';

  const generateTitleLinks = function(customSelector = ''){

    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';

    /* find all the articles and save them to variable: articles */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);

    let html = '';

    for(let article of articles){

      /* get the article id */
      const articleID = article.getAttribute('id');

      /* get the title from the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;

      /* create HTML of the link */
      const linkHTML = '<li><a href="#' + articleID + '"><span>' + articleTitle + '</span></a></li>';

      /* insert link into html variable */
      html = html + linkHTML;
    }

    /* insert links into titleList */
    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }

  };

  generateTitleLinks();

  const generateTags = function (){

    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for(let article of articles){

      /* find tags wrapper */
      const tagsWrapper = article.querySelector(optArticleTagsSelector);

      /* make html variable with empty string */
      let html = '';

      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');

      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');


      /* START LOOP: for each tag */
      for(let tag of articleTagsArray){

        /* generate HTML of  the link */
        const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';

        /* add generated code to html variable */
        html = html + linkHTML;

      /* END LOOP: for each tag */
      }

      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.innerHTML = html;

    /* END LOOP: for every article: */
    }
  };

  generateTags();

  const tagClickHandler = function(event){

    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');

    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

    /* START LOOP: for each active tag link */
    for (let activeTagLink of activeTagLinks){

      /* remove class active */
      activeTagLink.classList.remove('active');

    /* END LOOP: for each active tag link */
    }

    /* find all tag links with "href" attribute equal to the "href" constant */
    const selectedTagLinks = document.querySelectorAll('a[href="' + href + '"]');

    /* START LOOP: for each found tag link */
    for (let selectedTagLink of selectedTagLinks){

      /* add class active */
      selectedTagLink.classList.add('active');

    /* END LOOP: for each found tag link */
    }

    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  const addClickListenersToTags = function (){

    /* find all links to tags */
    const linkTags = document.querySelectorAll('.post-tags a');

    /* START LOOP: for each link */
    for(let linkTag of linkTags){

      /* add tagClickHandler as event listener for that link */
      linkTag.addEventListener('click', tagClickHandler);

    /* END LOOP: for each link */
    }

  };

  addClickListenersToTags();

  const generateAuthors = function (){

    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for(let article of articles){

      /* find authors wrapper */
      const authorsWrapper = article.querySelector(optArticleAuthorSelector);

      /* get author from data-author attribute */
      const articleAuthors = article.getAttribute('data-author');

      /* generate HTML of the link */
      const html = '<a href="#author-' + articleAuthors + '">' + articleAuthors + '</a>';

      /* insert author into the author wrapper */
      authorsWrapper.innerHTML = html;

    /* END LOOP: for every article: */
    }
  };

  generateAuthors();

  const authorClickHandler = function(event){

    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "author" and extract author from the "href" constant */
    const author = href.replace('#author-', '');

    /* find all author links with class active */
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

    /* START LOOP: for each active author link */
    for (let activeAuthorLink of activeAuthorLinks){

      /* remove class active */
      activeAuthorLink.classList.remove('active');

    /* END LOOP: for each active tag link */
    }

    /* find all author links with "href" attribute equal to the "href" constant */
    const selectedAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');

    /* START LOOP: for each found author link */
    for (let selectedAuthorLink of selectedAuthorLinks){

      /* add class active */
      selectedAuthorLink.classList.add('active');

    /* END LOOP: for each found author link */
    }

    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  };

  const addClickListenersToAuthors = function (){

    /* find all links to authors */
    const linkAuthors = document.querySelectorAll('.post-author a');

    /* START LOOP: for each link */
    for(let linkAuthor of linkAuthors){

      /* add tagClickHandler as event listener for that link */
      linkAuthor.addEventListener('click', authorClickHandler);

    /* END LOOP: for each link */
    }

  };

  addClickListenersToAuthors();

}
