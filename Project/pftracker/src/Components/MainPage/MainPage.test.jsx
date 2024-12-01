import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MainPage from './MainPage';

describe('MainPage Component', () => {
    test('renders the MainPage fully', () => {

        //Given
        const userId = 123; // Mock id

        //When
        render(<MainPage userId={userId} />);

        //Then
        //Check for title
        expect(screen.getByText(`Welcome, User ID: ${userId}`)).toBeInTheDocument();

        // Check Manual entry section
        expect(screen.getByText('Manual Entry')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Transaction Date')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Transaction Amount')).toBeInTheDocument();
        expect(screen.getByText('Submit Transaction')).toBeInTheDocument();

        //Check file input section
        expect(screen.getByText('Upload CSV')).toBeInTheDocument();
        expect(screen.getByText('Drag and drop your CSV file here')).toBeInTheDocument();
        expect(screen.getByText('Submit CSV')).toBeInTheDocument();

        //Check transaction section
        expect(screen.getByText('Transaction')).toBeInTheDocument();
        expect(screen.getByText('No transactions to show yet.')).toBeInTheDocument();
    });
});