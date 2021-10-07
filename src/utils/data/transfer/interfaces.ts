import { AuthProvider } from "../../auth/interfaces";

/**
 * The request passed to the fetcher
 */
export interface FetchRequest {

    url: string;

    method?: string | undefined;

    /**
     * The headers sent to the server
     */
    headers?: Record<string, string>;

    /**
     * The data to send to the server
     */
    data?: any;

    cors?: boolean;

    params?: any;

    authProvider?: AuthProvider;
}

/**
 * The error response returned by the server
 */
export interface ErrorResponse {

    status: number;

    statusText: string;

    /**
     * Extra data returned by the server in the response
     */
    payload: any;
}

/**
 * Callbacks to be implemented in order to handle the different fetch scenarios
 */
export interface FetchCallbacks {

    onResponse?: (response: Response) => void;

    onError?: (error: ErrorResponse) => void;

    onData?: (data: Record<string, any>) => void;
}

/**
 * Builds a query string with the fields to select
 */
export interface ISelectUrlBuilder {

    /**
     * The name of the property to use to build the string of fields to select
     */
    selectProperty?: string;
}

/**
 * Configuration data passed to the build function of SelectableFieldsUrlBuilder
 */
export interface SelectUrlBuilderBuildConfig {

    /**
     * The URL of the back end to get the data from
     */
    url: string;

    /**
     * The array of fields to select
     */
    select?: string[];
}

/**
 * Builds the query string with the filter
 */
export interface FilterUrlBuilder {

    /**
     * The function that builds the OData fragment out of the filter 
     */
    build(): string;
}

/**
 * The sort order of the fields
 */
export type SortOrder = "asc" | "desc";

/**
 * The sorter of the fields
 */
export interface SorterUrlBuilder {

    /**
     * The name of the field to sort
     */
    field: string;

    /**
     * The sort order of the field
     */
    order: SortOrder
}

export interface ICollectionUrlBuilder {

    filterProperty?: string;

    filterBuilder?: FilterUrlBuilder;

    orderByProperty?: string;

    topProperty?: string;

    skipProperty?: string;
}

/**
 * Configuration passed to the constructor of CollectionUrlBuilder
 */
export interface CollectionUrlBuilderConfig extends ICollectionUrlBuilder, ISelectUrlBuilder { }

/**
 * Configuration passed to the build function of CollectionUrlBuilder
 */
export interface CollectionUrlBuilderBuildConfig extends SelectUrlBuilderBuildConfig {

    top?: number;

    skip?: number;

    filter?: any;

    orderBy?: SorterUrlBuilder[];

    [otherParams : string]: any;
}

/**
 * Configuration passed to the constructor of CollectionFetchLoader
 */
export interface CollectionLoaderConfig extends FetchCallbacks {

    urlBuilder?: CollectionUrlBuilderConfig;
}

/**
 * Configuration passed to the constructor of SingleRecordLoader
 */
export interface SingleRecordLoaderConfig extends FetchCallbacks {

    urlBuilder?: ISelectUrlBuilder;
}