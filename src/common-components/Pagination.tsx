import React from 'react';
import classNames from 'classnames';
import "./Pagination.css";

const noop = (any: any) => {
};

interface PageButtonProps {
    page: number,
    label?: string | number,
    isCurrent?: boolean,
    disabled?: boolean,
    onClick?: (page: number) => void,
}

export const filterPage = (page: number, rowsPerPage: number) => (row: any, index: number): boolean => Math.ceil((index + 1) / rowsPerPage) === page;
export const calcPages = (rows: number, rowsPerPage: number): number => Math.ceil(rows / rowsPerPage);

const PAGE_LABELS = {
    prev: '‹',
    ellipsis: '…',
    next: '›',
};

const DEFAULT_MAX_PAGES = 9;

const CurrentPageButton: React.FC<PageButtonProps> = ({page, label = null}) => {
    return (
        <li className={classNames('page-item active')}>
            <span className="page-link">{label || page}</span>
        </li>
    )
};

const SelectablePageButton: React.FC<PageButtonProps> = ({page, label = null, disabled = false, onClick = noop}) => {
    const handleClick = (ev: React.MouseEvent) => {
        ev.preventDefault();
        onClick(page);
    };
    return (
        <li className={classNames('page-item', {disabled: disabled})}>
            <a href="#" className='page-link' onClick={handleClick}>{label || page}</a>
        </li>
    )
};

const PageButton: React.FC<PageButtonProps> = ({page, label = '', disabled = false, isCurrent = false, onClick}) => {
    return (
        isCurrent
            ? <CurrentPageButton page={page} label={label}/>
            : <SelectablePageButton page={page} label={label} disabled={disabled} onClick={onClick}/>
    )
};

export interface PaginationProps {
    page: number,
    pages: number,
    filtered?: boolean,
    className?: string | object,
    maxButtons?: number,
    onSelectPage: (page: number) => void,
}

const Pagination: React.FC<PaginationProps> = ({
                                                   page,
                                                   pages,
                                                   filtered,
                                                   className,
                                                   maxButtons = DEFAULT_MAX_PAGES,
                                                   onSelectPage
                                               }) => {
    const onSelect = (nextPage: number) => {
        if (!nextPage || nextPage < 1 || nextPage > pages) {
            return;
        }
        onSelectPage(nextPage);
    }
    const hasMore = pages > maxButtons;
    const maxPageButtons = pages > maxButtons ? maxButtons - 2 : maxButtons;

    let renderPages = [];
    const pageRange = Math.floor(maxPageButtons / 2);
    const beforeRender = Math.min(page - pageRange, pages - maxPageButtons);
    const afterRender = Math.max(page + pageRange, maxPageButtons);
    const firstEllipsis = [];
    const lastEllipsis = [];
    for (let i = 2; i < pages; i += 1) {
        if (i <= beforeRender) {
            firstEllipsis.push(i);
        } else if (i < afterRender) {
            renderPages.push(i);
        } else {
            lastEllipsis.push(i);
        }
    }

    return (
        <nav aria-label="Page Navigation">

            <ul className={classNames("pagination pagination-sm", className, {filtered})}>
                {hasMore && (
                    <PageButton page={page - 1} label={PAGE_LABELS.prev} disabled={page <= 1} onClick={onSelect}/>
                )}
                <PageButton page={1} onClick={onSelect} isCurrent={page === 1}/>
                {hasMore && firstEllipsis.length === 1 && (
                    <PageButton page={firstEllipsis[0]} label={firstEllipsis[0]}/>
                )}
                {hasMore && firstEllipsis.length > 1 && (
                    <PageButton page={0} label={PAGE_LABELS.ellipsis} disabled={true}/>
                )}
                {renderPages.map(p => (
                    <PageButton key={p} page={p} isCurrent={p === page} onClick={onSelect}/>
                ))}
                {hasMore && lastEllipsis.length === 1 && (
                    <PageButton page={lastEllipsis[0]} label={lastEllipsis[0]}/>
                )}
                {hasMore && lastEllipsis.length > 1 && (
                    <PageButton page={0} label={PAGE_LABELS.ellipsis} disabled={true}/>
                )}
                {pages > 1 && (
                    <PageButton page={pages} isCurrent={page === pages} label={pages} onClick={onSelect}/>
                )}
                {hasMore && (
                    <PageButton page={page + 1} label={PAGE_LABELS.next} onClick={onSelect}
                                disabled={page === pages}/>
                )}
            </ul>
        </nav>
    )
}
export default Pagination;
