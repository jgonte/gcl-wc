import css from "../../custom-element/helpers/css";

const styles = css`
:host {
    display: flex;
    flex-flow: column nowrap;
    flex: 1 1 auto;
}

    .th {
    display: none;
    font-weight: 700;
    background-color: #f2f2f2;
    }

    .th > .td {
    white-space: normal;
    justify-content: center;
    }

    .tr {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    }

    .tr:nth-of-type(even) {
    background-color: #f2f2f2;
    }

    .tr:nth-of-type(odd) {
    background-color: #ffffff;
    }

    .td {
    display: flex;
    flex-flow: row nowrap;
    flex-grow: 1;
    flex-basis: 0;
    padding: 0.5em;
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0px;
    white-space: nowrap;
    border-bottom: 1px solid #d0d0d0;
    }
`;

export default styles;