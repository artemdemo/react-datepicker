import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import Days from '../Days/Days';
import Time from '../Time/Time';
import Separator from '../Separator/Separator';
import TitleController from '../TitleController/TitleController';
import { propIsMoment } from '../propTypes';

import './Calendar.less';
import Months from '../Months/Months';

export class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.handleClickOutside = this.handleClickOutside.bind(this);

        const { date } = props;
        this.state = {
            viewDays: true,
            monthDate: date,
            selectedDate: date,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.date !== nextProps.date) {
            this.setState({
                monthDate: nextProps.date,
            });
        }
    }

    handleClickOutside(e) {
        const { onClickOutside } = this.props;
        onClickOutside && onClickOutside(e);
    }

    handleDayChange(selectedDate) {
        const { onChange } = this.props;
        this.setState({
            selectedDate,
        });
        onChange && onChange(selectedDate);
    }

    handleTimeChange(newDate) {
        const { onChange } = this.props;
        onChange && onChange(newDate);
    }

    handleMonthChange(monthDate) {
        this.setState({
            monthDate,
            viewDays: true,
        });
    }

    handleViewChange() {
        this.setState({
            viewDays: !this.state.viewDays,
        });
    }

    renderView() {
        const { isValidDate, test } = this.props;
        let view;
        if (this.state.viewDays) {
            view = (
                <Days
                    date={this.state.monthDate}
                    selectedDate={this.state.selectedDate}
                    isValidDate={isValidDate}
                    onDateChange={this.handleDayChange.bind(this)}
                    test={test}
                />
            );
        } else {
            view = (
                <Months
                    date={this.state.monthDate}
                    selectedDate={this.state.selectedDate}
                    isValidDate={isValidDate}
                    onDateChange={this.handleMonthChange.bind(this)}
                    test={test}
                />
            );
        }
        return (
            <div className='datetime-calendar__view'>
                {view}
            </div>
        );
    }

    renderTime() {
        const { date, timeFormat } = this.props;
        if (!timeFormat) {
            return null;
        }
        return (
            <div>
                <Separator />
                <Time
                    date={date}
                    timeFormat={timeFormat}
                    onChange={this.handleTimeChange.bind(this)}
                />
            </div>
        );
    }

    render() {
        const titleFormat = this.state.viewDays ? 'MMMM, YYYY' : 'YYYY';
        return (
            <div className='datetime-calendar'>
                <TitleController
                    date={this.state.monthDate}
                    format={titleFormat}
                    onTitleClick={this.handleViewChange.bind(this)}
                    onChange={this.handleMonthChange.bind(this)}
                />
                <Separator />
                {this.renderView()}
                {this.renderTime()}
            </div>
        );
    }
}

Calendar.displayName = 'Calendar';

Calendar.propTypes = {
    date: propIsMoment.isRequired,
    timeFormat: PropTypes.string.isRequired,
    onClickOutside: PropTypes.func,
    onChange: PropTypes.func,
    isValidDate: PropTypes.func,
    test: PropTypes.bool,
};

Calendar.defaultProps = {
    timeFormat: null,
    onClickOutside: null,
    onChange: null,
    isValidDate: null,
    test: false,
};

export default onClickOutside(Calendar);
