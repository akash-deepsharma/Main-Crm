'use client'
import React, { useEffect, useRef, useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import getIcon from '@/utils/getIcon';

const SelectDropdown = ({ options, selectedOption, onSelectOption, className, defaultSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [openUpwards, setOpenUpwards] = useState(false);

    const [localSelectedOption, setLocalSelectedOption] = useState(null);
    const dropdownRef = useRef(null);

    // 🔥 Sync with parent & defaultSelect
    useEffect(() => {
        if (selectedOption) {
            setLocalSelectedOption(selectedOption);
        } else if (defaultSelect) {
            const defaultOption = options.find(
                opt => opt.value.toLowerCase() === defaultSelect.toLowerCase()
            );
            setLocalSelectedOption(defaultOption || null);
        }
    }, [selectedOption, defaultSelect, options]);

    // Click outside close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOptionClick = (option) => {
        setLocalSelectedOption(option);
        onSelectOption(option);
        setIsOpen(false);
    };

    return (
        <div className={`select-dropdown ${className || ""}`} ref={dropdownRef}>
            <div className="select-box" onClick={toggleDropdown}>
                <span className="selected-label">
                    {localSelectedOption?.color && (
                        <span className="status-dot" style={{ backgroundColor: localSelectedOption.color }}></span>
                    )}
                    {localSelectedOption?.label}
                </span>
                <span className="arrow">
                    {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                </span>
            </div>

            {isOpen && (
                <div className="dropdown-list">
                    <div className='search-input-outer'>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <ul>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => (
                                <li
                                    key={option.value}
                                    onClick={() => handleOptionClick(option)}
                                    className={option.value === localSelectedOption?.value ? "active" : ""}
                                >
                                    {option?.color && (
                                        <span className="status-dot" style={{ backgroundColor: option.color }}></span>
                                    )}
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li className="no-result">No results found</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SelectDropdown;
