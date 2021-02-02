/**
 * A functional React component showing a countdown.
 * 
 * Properties:
 * @param {number} endTimestamp unix epoch in milliseconds
 * 
 * @author Benjamin Knoop <benjamin@bennys-planet.de>
 */

import React, { forwardRef, useState, useEffect, useImperativeHandle } from 'react';
import './Countdown.css';

const CountdownState = {
    RUNNING: 'RUNNING',
    PAUSED: 'PAUSED',
    TIMEDOUT: 'TIMEDOUT'
};

/**
 * Calculates the difference between the end time as unix epoch in milliseconds and the current system time. The endTimestamp is assumed to be in the future, otherwise -1 will be returned (to encode an error and not a timed out operation).
 * @param {number} endTimestamp unix epoch in milliseconds
 * @returns {number} time difference in seconds
 */
const calculateRemainingSeconds = (endTimestamp) => {
    const diff = endTimestamp - Date.now();
    return diff > 0 ? Math.floor(diff / 1000) : -1;
};

/**
 * Creates an object with hours, minutes, seconds, where these time values add up to the (absolute) time difference between the given dates. 
 * @param {number} startTimestamp unix epoch in milliseconds
 * @param {number} endTimestamp unix epoch in milliseconds
 * @returns {object} time difference in {hours, minutes, seconds}
 */
const calculateTimeDifference = (startTimestamp, endTimestamp) => {
    const delta = {
        hours: 0,
        minutes: 0,
        seconds: 0
    };

    // check if endDate lies relatively in the past
    if (startTimestamp > endTimestamp) {
        return delta;
    }

    // compute the time difference in milliseconds
    const deltaInMillis = Math.abs(startTimestamp - endTimestamp);

    // convert to seconds
    var seconds = Math.floor(deltaInMillis / 1000);

    // hours
    delta.hours = Math.floor(seconds / 3600);
    seconds -= delta.hours * 3600;

    // minutes
    delta.minutes = Math.floor(seconds / 60);
    seconds -= delta.minutes * 60;

    // (remaining) seconds
    delta.seconds = seconds;

    return delta;
};

/**
 * Takes a delta object and returns a formatted string. The format is dependent if the hours are non-zero: 'HH:SS:MM' or 'SS:MM'
 * @param {object} delta time values to format
 * @returns {string} formatted time string
 */
const formatDeltaTimeAsString = (delta) => {
    const hoursString = delta.hours < 10 ? '0' + delta.hours : delta.hours;
    const minutesString = delta.minutes < 10 ? '0' + delta.minutes : delta.minutes;
    const secondsString = delta.seconds < 10 ? '0' + delta.seconds : delta.seconds;
    if (delta.hours > 0) {
        return hoursString + ':' + minutesString + ':' + secondsString;
    } else {
        return minutesString + ':' + secondsString;
    }

}

/**
 * Functional React component to display the remaining hours, minutes and seconds until a given end date as property
 * @param {number} endTimestamp unix epoch in milliseconds
 */
const Countdown = ({ endTimestamp, onTimedOut }) => {
    // initially the counter is running
    const [countdownState, setCountdownState] = useState(CountdownState.RUNNING);

    // state 'remainingSeconds' is updated to trigger a re-rendering
    const [, setRemainingSeconds] = useState(calculateRemainingSeconds(endTimestamp));

    // tick callback
    const tick = () => {
        if(countdownState === CountdownState.RUNNING) {
            const remainder = calculateRemainingSeconds(endTimestamp);
            setRemainingSeconds(remainder)

            // check if timed out
            if(remainder < 0) {
                // call timedOut callback if available
                if(onTimedOut) {
                    onTimedOut();
                }
                // and set counter to paused
                setCountdownState(CountdownState.TIMEDOUT);
        }

        }

    }

    const isPaused = countdownState === CountdownState.PAUSED;

    const togglePaused =  () => {
                if(countdownState === CountdownState.PAUSED) {
                    setCountdownState(CountdownState.RUNNING);
                } else if(countdownState === CountdownState.RUNNING) {
                    setCountdownState(CountdownState.PAUSED);
                }
                // alert('toggled ' + countdownState);
            }

    // update every second...
    useEffect(() => {
        const timer = setInterval(() => {
            tick();
        }, 1000);

        return () => clearInterval(timer);
    });

    // format data for output
    const delta = calculateTimeDifference(Date.now(), endTimestamp);

    // get locale
    const lang = navigator.language;

    const endDate = new Date(endTimestamp)
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    // localized strings
    let testTitlingString = 'Remaining test time'
    let testEndString = 'This test ends on';
    let endDateString = endDate.toLocaleDateString("en-us", options) + ' at ' + endDate.toLocaleTimeString(options);
    if (lang.startsWith('de')) {
        testTitlingString = 'Restliche Testzeit'
        testEndString = 'Dieser Test endet am';
        endDateString = endDate.toLocaleDateString("de-de", options) + ' um ' + endDate.toLocaleTimeString(options) + ' Uhr';
    }

    return (
        <div className="countdown-container">
            <div className="countdown-spacer" />
            <div className="countdown-titling">{testTitlingString}</div>
            <div className="countdown-timer">{formatDeltaTimeAsString(delta)}</div>
            <div className="countdown-subtitle">
                <div className="countdown-text">{testEndString}&nbsp;</div>
                <div className="countdown-text">{endDateString}</div>
            </div>
            <div className="countdown-spacer" />
            <button onClick={togglePaused}>{isPaused ? 'Resume' : 'Pause'} this!</button>
        </div>
    )
};

export default Countdown; 