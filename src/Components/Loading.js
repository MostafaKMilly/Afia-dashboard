import React from 'react';
import { Spinner } from 'react-bootstrap';

function Loading() {
    return (
        <div className="vertical-center">
            <div className="col-12" align="center">
                <Spinner animation="border" role="status" variant="dark" size="lg" />
                <p className="mt-1">Loading ...</p>
            </div>
        </div>
    );
}
export default Loading;