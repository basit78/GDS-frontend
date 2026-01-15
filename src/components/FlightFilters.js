import React, { useState, useEffect } from 'react';
import airlinesData from '../airlines.json';
import './FlightFilters.css';

const FlightFilters = ({ flights, onFilterChange }) => {
    const [maxPriceLimit, setMaxPriceLimit] = useState(2000);
    const [currentPrice, setCurrentPrice] = useState(2000);
    const [selectedStops, setSelectedStops] = useState([]);
    const [selectedAirlines, setSelectedAirlines] = useState([]);
    const [availableAirlines, setAvailableAirlines] = useState([]);

    useEffect(() => {
        if (flights && flights.length > 0) {
            const airlines = new Set();
            let highestPrice = 0;

            flights.forEach(flight => {
                const price = parseFloat(flight.price.total);
                if (price > highestPrice) highestPrice = price;

                flight.itineraries[0].segments.forEach(segment => {
                    airlines.add(segment.carrierCode);
                });
            });

            const airlinesList = Array.from(airlines).map(code => {
                const airline = airlinesData.find(a => a.iata === code);
                return {
                    code,
                    name: airline ? airline.name : code
                };
            });

            setAvailableAirlines(airlinesList);
            setMaxPriceLimit(Math.ceil(highestPrice));
            setCurrentPrice(Math.ceil(highestPrice));
        }
    }, [flights]);

    const handlePriceChange = (e) => {
        const value = parseInt(e.target.value);
        setCurrentPrice(value);
        onFilterChange({ price: value, stops: selectedStops, airlines: selectedAirlines });
    };

    const handleStopChange = (stop) => {
        const updatedStops = selectedStops.includes(stop)
            ? selectedStops.filter(s => s !== stop)
            : [...selectedStops, stop];

        setSelectedStops(updatedStops);
        onFilterChange({ price: currentPrice, stops: updatedStops, airlines: selectedAirlines });
    };

    const handleAirlineChange = (airlineCode) => {
        const updatedAirlines = selectedAirlines.includes(airlineCode)
            ? selectedAirlines.filter(a => a !== airlineCode)
            : [...selectedAirlines, airlineCode];

        setSelectedAirlines(updatedAirlines);
        onFilterChange({ price: currentPrice, stops: selectedStops, airlines: updatedAirlines });
    };

    return (
        <div className="flight-filters">
            <div className="filter-header">
                <h3>Filters</h3>
                <button
                    className="reset-btn"
                    onClick={() => {
                        setSelectedStops([]);
                        setSelectedAirlines([]);
                        setCurrentPrice(maxPriceLimit);
                        onFilterChange({ price: maxPriceLimit, stops: [], airlines: [] });
                    }}
                >
                    Reset
                </button>
            </div>

            <div className="filter-section">
                <h4>Stops</h4>
                <div className="filter-options">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={selectedStops.includes(0)}
                            onChange={() => handleStopChange(0)}
                        />
                        Direct
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={selectedStops.includes(1)}
                            onChange={() => handleStopChange(1)}
                        />
                        1 Stop
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={selectedStops.includes(2)}
                            onChange={() => handleStopChange(2)}
                        />
                        2+ Stops
                    </label>
                </div>
            </div>

            <div className="filter-section">
                <h4>Max Price</h4>
                <div className="price-slider">
                    <input
                        type="range"
                        min="0"
                        max={maxPriceLimit}
                        value={currentPrice}
                        onChange={handlePriceChange}
                    />
                    <div className="price-labels">
                        <span>0 USD</span>
                        <span className="current-price">{currentPrice} USD</span>
                        <span>{maxPriceLimit} USD</span>
                    </div>
                </div>
            </div>

            <div className="filter-section">
                <h4>Airlines</h4>
                <div className="filter-options scrollable">
                    {availableAirlines.map(airline => (
                        <label key={airline.code} className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={selectedAirlines.includes(airline.code)}
                                onChange={() => handleAirlineChange(airline.code)}
                            />
                            {airline.name}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FlightFilters;
