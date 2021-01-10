import Hunt, { HuntBase, HuntWithProperties } from '../models/Hunt';
import Roster from '../models/Roster';
import * as ApiPaths from '../routes/ApiPaths';
import * as ApiRequest from './apiRequests';

export type HuntPost = Pick<HuntBase, 'name'>;

export function getHunts(roster: string | Roster) {
    return ApiRequest.getItem<Hunt[]>(ApiPaths.huntsPath(roster));
}

export function getHunt(hunt: string | Hunt) {
    return ApiRequest.getItem<HuntWithProperties>(ApiPaths.huntPath(hunt));
}

export function deleteHunt(hunt: string | Hunt) {
    return ApiRequest.deleteItem(ApiPaths.huntPath(hunt));
}

export function createHunt(roster: string | Roster, hunt: HuntPost) {
    return ApiRequest.postItem<HuntPost, Hunt>(ApiPaths.huntsPath(roster), hunt);
}

export function updateHunt(hunt: string | Hunt, post: Partial<HuntPost>) {
    return ApiRequest.patchItem<Partial<HuntPost>, Hunt>(ApiPaths.huntPath(hunt), post);
}

/**
 * Attaches the given template PDF to the given hunt.
 * @param hunt The hunt to which the attachment should be placed.
 * @param formData The form data containing the template to be uploaded. This must have the TEMPLATE_PDF_FORM_KEY
 * key present.
 */
export function attachTemplatePdf(hunt: string | Hunt, formData: FormData) {
    return ApiRequest.postItem<FormData, { url: string }>(ApiPaths.templatePdfPath(hunt), formData);
}

export function deleteTemplatePdf(hunt: string | Hunt) {
    return ApiRequest.deleteItem(ApiPaths.templatePdfPath(hunt));
}

export type InstantPrintUpdate = {
    output_url: string | undefined;
    success: boolean;
};

function isInstantPrintUpdate(obj: unknown): boolean {
    return (
        !(obj === null || obj === undefined) &&
        typeof obj === 'object' &&
        'success' in (obj as Record<string, unknown>) &&
        typeof (obj as InstantPrintUpdate).success === 'boolean'
    );
}

/**
 * Converts the unknown object to an instant print update if it is an instant print update.
 * @param obj The unknown object that may be an instant print update.
 */
export function asInstantPrintUpdate(obj: unknown): InstantPrintUpdate | undefined {
    return isInstantPrintUpdate(obj) ? (obj as InstantPrintUpdate) : undefined;
}
