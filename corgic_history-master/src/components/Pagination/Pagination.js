import React from 'react';
// import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { Icon, Pagination as SemanticPagination } from 'semantic-ui-react'
import './Pagination.scss'

const CustomPagination = ({ pages, page, onChangePage }) => {

  // const [pageNumberLimit, setpageNumberLimit] = useState(5);
  // const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
  // const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const handlePaginationChange = (e, { activePage }) => {
    console.log(activePage)
    // let goTo = number + 1;
    let goTo = activePage;
    if ((goTo !== page) && (goTo >= 1) && (goTo <= pages)) {
      onChangePage(goTo)
    }
  }
  // const goToNext = () => {
  //   onPageChange(page)

  //   if (page + 1 > maxPageNumberLimit) {
  //     setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
  //     setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
  //   }

  // }
  // const goToPrevious = () => {
  //   onPageChange(page - 2)

  //   if ((page - 1) % pageNumberLimit == 0) {
  //     setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
  //     setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
  //   }

  // }
  // const goToStart = () => {
  //   onPageChange(0)
  //    setminPageNumberLimit(0);
  //    setmaxPageNumberLimit(5); 
  // }
  // const goToEnd = () => {
  //   let minEndlimit = ((Math.ceil(pages/pageNumberLimit)) * pageNumberLimit) - pageNumberLimit;
  //   let maxEndlimit = (Math.ceil(pages/pageNumberLimit)) * pageNumberLimit;
  //   onPageChange(pages - 1)
  //   setmaxPageNumberLimit(minEndlimit)
  //   setmaxPageNumberLimit(maxEndlimit)
  // }

  // let pageIncrementBtn = null;
  // if (pages > maxPageNumberLimit) {
  //   pageIncrementBtn = 
  //   <PaginationItem onClick={goToNext}> 
  //     <PaginationLink>&hellip;</PaginationLink> 
  //   </PaginationItem>;
  // }

  // let pageDecrementBtn = null;
  // if (minPageNumberLimit >= 1) {
  //   pageDecrementBtn = 
  //   <PaginationItem onClick={goToPrevious}> 
  //     <PaginationLink>&hellip;</PaginationLink> 
  //   </PaginationItem>;
  // }

  return (
    <div className="custom-pagination-container">
      <div className="total">
        ( {page} of {pages} )
      </div>
      <SemanticPagination
        activePage={page}
        defaultActivePage={page}
        ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
        prevItem={{ content: <Icon name='angle left' />, icon: true }}
        nextItem={{ content: <Icon name='angle right' />, icon: true }}
        totalPages={pages}
        firstItem={null}
        lastItem={null}
        onPageChange={handlePaginationChange}
      />
      {/*
      <Pagination size="md" aria-label="Page navigation example">
      <PaginationItem
        onClick={goToStart}
        disabled={page === 1 ? true : false}
      >
        <PaginationLink first />
      </PaginationItem>
      <PaginationItem
        onClick={goToPrevious}
        disabled={page === 1 ? true : false}
      >
        <PaginationLink previous />
      </PaginationItem>
      {pageDecrementBtn}
        {
          pages &&
          [...Array(pages)].map((i, index) => {
            if (index < maxPageNumberLimit  && index + 1 > minPageNumberLimit) {
              return (
                <PaginationItem
                  key={index}
                  onClick={() => onPageChange(index)}
                  active={page === index + 1 ? true : false}
                >
                  <PaginationLink>
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            } else {
              return null;
            }
          })
        }  
        {pageIncrementBtn}      
        <PaginationItem
          onClick={goToNext}
          disabled={page === pages ? true : false}
        >
          <PaginationLink next />
        </PaginationItem>
        <PaginationItem
          onClick={goToEnd}
          disabled={page === pages ? true : false}
        >
          <PaginationLink last />
        </PaginationItem>
      </Pagination>
      */}
    </div>
  );
}

export default CustomPagination;