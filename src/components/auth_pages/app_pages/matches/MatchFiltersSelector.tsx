import React from 'react';
import { Col, Form } from 'react-bootstrap';
import Select, { OptionsType, ValueType } from 'react-select';
import { MatchFilters } from '../../../../api/matchAPI';

const STATE_SELECT_NAME = 'ongoing' as const;

type OptionType = { label: string; value: string };

export type Props = {
    /** Number of rounds in the hunt in which these matches belong. */
    numRounds: number;
    currentFilters: MatchFilters;
    /** Function to call with the complete new filters object. */
    setFilters: (updatedFilter: MatchFilters) => void;
};

export default function MatchFiltersSelector({ numRounds, currentFilters, ...props }: Props): JSX.Element {
    function updateFilters(changes: Partial<MatchFilters>): void {
        props.setFilters({ ...currentFilters, ...changes });
    }

    function handleFormChange({ target }: React.ChangeEvent<HTMLInputElement>): void {
        const newFilters: MatchFilters = {};
        switch (target.name) {
            case STATE_SELECT_NAME:
                newFilters[STATE_SELECT_NAME] = target.value.length === 0 ? undefined : target.value === 'true';
                break;
        }

        Object.keys(newFilters).length > 0 && updateFilters(newFilters);
    }

    function roundNumberToOptionType(roundNumber: number): OptionType {
        const stringNumber: string = roundNumber.toString();
        return { label: stringNumber, value: stringNumber };
    }

    const stateValue: string = currentFilters.ongoing?.toString() || '';
    const roundOptions: OptionsType<OptionType> = Array.from(new Array(numRounds), (_, i) => {
        return roundNumberToOptionType(i + 1);
    });
    const selectedRounds: OptionsType<OptionType> =
        (currentFilters.round !== undefined &&
            (typeof currentFilters.round === 'number'
                ? [roundNumberToOptionType(currentFilters.round)]
                : currentFilters.round.sort().map(roundNumberToOptionType))) ||
        [];

    function handleSelectChange(value: ValueType<OptionType>): void {
        let newSelectedRoundNumbers: MatchFilters['round'];
        if (value) {
            if (Array.isArray(value)) {
                newSelectedRoundNumbers = (value as OptionsType<OptionType>).map(({ value }) => parseInt(value));
            } else {
                newSelectedRoundNumbers = parseInt((value as OptionType).value);
            }
        } else {
            newSelectedRoundNumbers = undefined;
        }
        updateFilters({ round: newSelectedRoundNumbers });
    }

    return (
        <Form>
            <Form.Row>
                <Col md="4">
                    <Form.Group controlId="roundSelector">
                        <Form.Label>Round</Form.Label>
                        <Select<OptionType>
                            isDisabled={numRounds === 0}
                            isMulti
                            name="rounds"
                            options={roundOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleSelectChange}
                            value={selectedRounds}
                        />
                    </Form.Group>
                </Col>
                <Col md="4">
                    <Form.Group controlId="ongoingSelector">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                            as="select"
                            name={STATE_SELECT_NAME}
                            value={stateValue}
                            onChange={handleFormChange}
                        >
                            <option value="">All</option>
                            <option value="true">Ongoing</option>
                            <option value="false">Closed</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Form.Row>
        </Form>
    );
}
