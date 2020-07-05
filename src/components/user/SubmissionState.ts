enum SubmissionState {
    /** Haven't yet submitted the form. */
    Pending,
    /** Form has been submitted, awaiting a response. */
    Submitting,
    /** Received successful response. */
    SubmissionSuccess,
    /** Received failed response. */
    SubmissionFailed,
}

export default SubmissionState;
