import React from 'react';
import SheepLoader from '../SheepLoader';

const Loader = ({ size = 'md', label }) => {
    return (
        <div className="flex justify-center items-center">
            <SheepLoader size={size} label={label} />
        </div>
    );
};

export { Loader };
