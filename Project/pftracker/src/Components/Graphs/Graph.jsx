import React, { useEffect, useState } from 'react';

const MonthlySpendingChart = ({ transactions }) => {
    const parseDate = (dateString) =>{
        const[day, month, year] = dateString.split('/');
        return new Date(`${year}-${month}-${day}`);
    };
}