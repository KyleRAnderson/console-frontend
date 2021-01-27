import React, { useRef, useState } from 'react';
import { ValueType } from 'react-select';
import Select from 'react-select';
import License from '../../../../models/License';

/** Amount of time to wait before searching, in milliseconds. */
const WAIT_TIME = 500;

type OptionType = { label: string; value: License };

export type Props = {
    /** Function that searched for licenses based on the user's inputted keywords. */
    licenseSearcher: (keyword: string) => Promise<License[]>;
    /** Callback for when the user picks one of the license search results. */
    onLicenseSelected: (selected: License) => void;
    disabled?: boolean;
    /** The current value for the license that has been selected. */
    value?: License;
};

/** A search bar specifically for finding licenses and providing them. */
export default function LicenseSearch(props: Props): JSX.Element {
    const delay = useRef<NodeJS.Timeout | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [options, setOptions] = useState<OptionType[]>([]);

    function handleChange(value: ValueType<OptionType, false>): void {
        if (value && !Array.isArray(value)) {
            props.onLicenseSelected((value as OptionType).value);
        }
    }

    function licenseToEntry(license: License): OptionType {
        return {
            value: license,
            label: `${license.participant.first} ${license.participant.last}, ${Object.values(
                license.participant.extras,
            ).join(',')}`,
        };
    }

    async function loadLicenses(input: string): Promise<OptionType[]> {
        setIsLoading(true);
        const values = await props.licenseSearcher(input);
        setIsLoading(false);
        return values.map(licenseToEntry);
    }

    function getLicenses(input: string): void {
        loadLicenses(input).then(setOptions);
    }

    function handleInputChange(newValue: string): void {
        if (newValue.length > 0) {
            delay.current && clearTimeout(delay.current);
            delay.current = global.setTimeout(() => getLicenses(newValue), WAIT_TIME);
        } else {
            setOptions([]);
        }
    }

    return (
        <Select<OptionType>
            noOptionsMessage={() => 'Start typing to get choices...'}
            isDisabled={props.disabled}
            isLoading={isLoading}
            cacheOptions
            onChange={handleChange}
            onInputChange={handleInputChange}
            defaultValue={props.value && licenseToEntry(props.value)}
            options={options}
        />
    );
}
