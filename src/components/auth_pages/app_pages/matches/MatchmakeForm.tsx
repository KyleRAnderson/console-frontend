import React, { useState } from 'react';
import Board, { moveCard } from '@lourenci/react-kanban';
import MatchAPI from '../../../../api/matchAPI';
import { Button } from 'react-bootstrap';

type Props = {
    onSubmit?: (matchmakeParams: MatchAPI.MatchmakeParams) => void;
    participantProperties: string[];
};

type Card = {
    id: number | string;
    title: string;
    description?: string;
};

type DndColumn = {
    id: number | string;
    title: string;
    cards: Card[];
};

type Board = DndColumn[];

export default function MatchmakeForm(props: Props): JSX.Element {
    const propertiesCards: Card[] = props.participantProperties.map((property, index) => {
        return { id: index, title: property };
    });
    const initialBoard: Board = [
        { id: 1, title: 'Properties', cards: propertiesCards },
        { id: 2, title: 'Within', cards: [] },
        { id: 3, title: 'Between', cards: [] },
    ];

    const [board, setBoard] = useState<Board>(initialBoard);

    function onFormSubmit(): void {
        props.onSubmit?.(grabProperties());
        resetForm();
    }

    function resetForm(): void {
        setBoard(initialBoard);
    }

    function grabProperties(): MatchAPI.MatchmakeParams {
        const withinProperties: string[] = board[1].cards.map((card) => card.title);
        const betweenProperties: string[] = board[2].cards.map((card) => card.title);
        return { within: withinProperties, between: betweenProperties };
    }

    function handleCardMove(_card: any, source: any, destination: any) {
        const updatedBoard: Board = moveCard(board, source, destination);
        setBoard(updatedBoard);
    }

    return (
        <>
            <Board onCardDragEnd={handleCardMove} disableColumnDrag>
                {board}
            </Board>
            <Button onClick={() => onFormSubmit()}>Matchmake!</Button>
        </>
    );
}
