import React from "react";
import ConnectedRowsPerPage from "./ConnectedRowsPerPage";
import ConnectedPagination from "./ConnectedPagination";

interface ConnectedPagerProps {
    pageKey?: string,
    dataLength?: number,
    filtered?: boolean
}

const ConnectedPager: React.FC<ConnectedPagerProps> = ({
                                                           pageKey = 'app',
                                                           dataLength = 0,
                                                           filtered = false,
                                                       }) => {
    return (
        <div className="row g-3">
            <div className="col-auto">
                <ConnectedRowsPerPage pageKey={pageKey}/>
            </div>
            <div className="col-auto">
                <ConnectedPagination pageKey={pageKey} dataLength={dataLength} filtered={filtered}/>
            </div>
        </div>
    )
}
export default ConnectedPager;
