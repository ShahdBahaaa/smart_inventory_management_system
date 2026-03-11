import React from 'react';
import { Outlet } from 'react-router-dom';
import PageHeader from '../../shared/Layout/PageHeader';

const ReportsLayout = () => {
    return (
        <div className="fade-in">
            <PageHeader
                title="Analytics & Reports"
                subtitle="Comprehensive data insights and exports"
            />
            <div className="mt-4">
                <Outlet />
            </div>
        </div>
    );
};

export default ReportsLayout;
