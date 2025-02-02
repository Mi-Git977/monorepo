import React from "react";
import { ModalInfo } from "./components/modals/modals";
import { ControlPanelTab } from "./components/taskpanes/ControlPanel/ControlPanelTaskpane";
import { TaskpaneInfo } from "./components/taskpanes/taskpanes";


/**
 * The different types of data manipulation that Mito supports.
 */
export enum StepType {
    Initialize = 'initialize',
    AddColumn = "add_column",
    DeleteColumn = "delete_column",
    RenameColumn = "rename_column",
    ReorderColumn = "reorder_column",
    FilterColumn = 'filter_column',
    SetColumnFormula = "set_column_formula",
    DataframeDelete = 'dataframe_delete',
    DataframeDuplicate = 'dataframe_duplicate',
    DataframeRename = 'dataframe_rename',
    SimpleImport = 'simple_import',
    Sort = 'sort',
    Pivot = 'pivot',
    Merge = 'merge',
    DropDuplicates = 'drop_duplicates',
    ChangeColumnDtype = 'change_column_dtype',
    ChangeColumnFormat = 'change_column_format',
    SetCellValue = 'set_cell_value',
    BulkOldRename = 'bulk_old_rename',
    ExcelImport = 'excel_import',
}

/**
 * The summary of a single step that has occured.
 * 
 * @param step_id - the unique ID of this specific step
 * @param step_idx - the index of the step among the currently run steps
 * @param step_type - the type of this step
 * @param step_display_name - the highest level name to describe what happened in this step
 * @param step_description - further discription of the step
 * @param params - parameters that were send to the backend for this step
 */
export interface StepSummary {
    step_id: string;
    step_idx: number;
    step_type: StepType;
    step_display_name: string;
    step_description: string;
    // TODO: in the future, we should extend the StepData interface for
    // each of the different steps, and type these more strongly!
    // Currently, we aren't sending this data!
    params?: Record<string, unknown>; 
}

/**
 * The original location of a specific dataframe.
 */
export enum DFSource {
    Passed = 'passed',
    Imported = 'imported',
    Pivoted = 'pivoted',
    Merged = 'merged',
    Duplicated = 'duplicated',
}

/**
 * The two different ways to combine filters together
 */
export type Operator = 'And' | 'Or';

export type BooleanFilterCondition = 'boolean_is_true'
| 'boolean_is_false'
| 'empty'
| 'not_empty'

export type StringFilterCondition = 'contains'
| 'string_does_not_contain'
| 'string_exactly'
| 'string_not_exactly'
| 'empty'
| 'not_empty'

export type NumberFilterCondition = 'number_exactly'
| 'number_not_exactly'
| 'greater'
| 'greater_than_or_equal'
| 'less'
| 'less_than_or_equal'
| 'empty'
| 'not_empty'

export type DatetimeFilterCondition = 'datetime_exactly'
| 'datetime_not_exactly'
| 'datetime_greater'
| 'datetime_greater_than_or_equal'
| 'datetime_less'
| 'datetime_less_than_or_equal'
| 'empty'
| 'not_empty'


export interface FilterType {
    condition: BooleanFilterCondition | StringFilterCondition | NumberFilterCondition | DatetimeFilterCondition;
    value: string | number;
}


export interface FilterGroupType {
    filters: FilterType[];
    operator: Operator
}

export interface ColumnFilters {
    operator: 'Or' | 'And',
    filters: (FilterType | FilterGroupType)[]
}

export interface ColumnFilterMap {
    [column: string]: ColumnFilters;
}

export interface ColumnFormatTypeObjMap {
    [Key: string]: FormatTypeObj;
}


/**
 * @param noErrorModal set in the backend by some events, when we want
 * to pass the error directly through to the caller
 */
export interface MitoError {
    event: string;
    type: string;
    header: string;
    to_fix: string;
    traceback?: string;
}

/**
 * A column header can be a string a number, or a boolean, as well as a
 * list of these items.
 * 
 * If it is a list of these items, then this is a multi-index column header
 * and should be displayed as such.
 */
export type PrimitiveColumnHeader = string | number | boolean;
export type MultiIndexColumnHeader = PrimitiveColumnHeader[]; // TODO: is this a bug? Can we have a multi-index with a multi-index inside it
export type ColumnHeader = PrimitiveColumnHeader | MultiIndexColumnHeader;


export type ColumnID = string;
/**
 * A map from column IDs -> Column Headers
 */
export type ColumnIDsMap = Record<ColumnID, ColumnHeader>;


/**
 * Data that will be displayed in the sheet itself.
 * 
 * @param dfName - the name of the dataframe
 * @param dfSource - the source of the dataframe
 * @param numRows - the number of rows in the data. Should be equal to data[0].length
 * @param numColumns - the number of columns in the data. Should be equal to data.length
 * @param data - a list of the columns to display in the sheet, including their id and header, their dtype, as well as a list of columnData (which is the actual data in this column)
 * @param columnIDsMap - for this dataframe, a map from column id -> column headers
 * @param columnSpreadsheetCodeMap - for this dataframe, a map from column id -> spreadsheet formula
 * @param columnFiltersMap - for this dataframe, a map from column id -> filter objects
 * @param columnDtypeMap - for this dataframe, a map from column id -> column dtype
 * @param index - the indexes in this dataframe
 * @param columnFormatTypeObjMap - for this dataframe, a map from columnd id -> the format type object applied to that column.
 */
export type SheetData = {
    dfName: string;
    dfSource: DFSource;
    numRows: number,
    numColumns: number,
    data: {
        columnID: ColumnID;
        columnHeader: ColumnHeader;
        columnDtype: string;
        columnData: (string | number | boolean)[];
    }[];
    columnIDsMap: ColumnIDsMap;
    columnSpreadsheetCodeMap: Record<ColumnID, string>;
    columnFiltersMap: ColumnFilterMap;
    columnDtypeMap: Record<ColumnID, string>;
    index: (string | number)[];
    columnFormatTypeObjMap: ColumnFormatTypeObjMap
};


/**
 * The current viewport of the sheet. As not all data is rendered, this object
 * marks what is actually rendered. Note that not all of it may be visible to 
 * the user.
 * 
 * @param startingRowIndex - The index of the first row to be rendered.
 * @param numRowsRendered - the number of rows in the data. Should be equal to data.length
 * @param startingColumnIndex - The index of the first column to be rendered.
 * @param numColumnsRendered - The number of columns to actually render. Some of them may not be visible.
 */
export interface SheetView {
    startingRowIndex: number;
    numRowsRendered: number;
    startingColumnIndex: number;
    numColumnsRendered: number;
}

/**
 * The current selection that the user has made in the sheet. Each of these values
 * can range from -1 to the maximum index of a column or a row (one less than the 
 * length of the sheet data). 
 * 
 * @remarks If the columnIndex is -1, then this is the IndexHeaders. If the rowIndex is -1, 
 * then this is the ColumnHeaders. This makes it easy to natually move selection
 * around between grid data and the headers.
 * 
 * @remarks The ending indexes can be less than the starting index, as the selection 
 * also encodes information about the direction that the user has done the selection.
 * 
 * @param startingRowIndex - The index of the row that the user first selected.
 * @param endingRowIndex - The index of the final row the user is selecting. Might be less than startingRowIndex.
 * @param startingColumnIndex - The index of the column that the user first selected.
 * @param endingColumnIndex - The index of the final column the user is selecting. Might be less than startingColumnIndex.
 */
export interface MitoSelection {
    startingRowIndex: number;
    endingRowIndex: number;
    startingColumnIndex: number;
    endingColumnIndex: number;
}

/**
 * The border style to be applied to a range of cells.
 * 
 * @param borderRight - The right border style
 * @param borderLeft - The left border style
 * @param borderTop - The top border style
 * @param borderBottom - The bottom border style
 */
export interface BorderStyle {
    borderRight?: string | undefined
    borderLeft?: string | undefined
    borderTop?: string | undefined
    borderBottom?: string | undefined
}

/**
 * The amount grid data, column headers, and index headers should
 * translate so that they are properly placed.
 * 
 * @param x - How much the renderer should translate in the x
 * @param y - How much the renderer should translate in the y
 */
export interface RendererTranslate {
    x: number;
    y: number;
}

/**
 * Stores the height and width of some div.
 * 
 * @param width - Width of the object represented
 * @param height - Height of the object represented
 */
export interface Dimension {
    width: number;
    height: number;
}

/**
 * Stores the amount the content inside a div has been
 * scrolled.
 * 
 * @param scrollTop - a measurement of the distance from the element's top to its topmost visible content.
 * @param scrollLeft - a measurement of the distance from the element's left to its topmost visible content.
 */
export interface ScrollPosition {
    scrollTop: number;
    scrollLeft: number;
}

/**
 * Stores the current state of the editor, keeping track of all the information
 * to allow the user to edit the cell. As we don't use a browser input, we have to 
 * keep track of more than usual.
 * 
 * The editor might be displayed as a cell editor or a column header editor, depending
 * on what exactly is being edited!
 * 
 * @param rowIndex - Row index of the cell being edited
 * @param columnIndex - Column index of the cell being edited
 * @param formula - The current formula. This might not be what is displayed to the user, if they have pendingSelectedColumns
 * @param pendingSelectedColumns - A list of columns that the user has selected through the arrow keys or clicking on columns. Also stores _where_ in the formula these columns should be inserted
 * @param arrowKeysScrollInFormula - The user can click on the editor to make the arrow keys scroll in the editor rather than in the sheet
 */
export type EditorState = {
    rowIndex: number;
    columnIndex: number;
    formula: string;

    pendingSelectedColumns?: {
        columnHeaders: (ColumnHeader)[]
        selectionStart: number,
        selectionEnd: number,
    };

    /* 
        Represents where the arrow keys should scroll, if the user
        types something. 
    */
    arrowKeysScrollInFormula?: boolean;
};

/**
 * Stores the width data of the columns in the sheet.
 * 
 * @param widthArray - At each index, stores the width of the column at that index, in pixels
 * @param widthSumArray - For efficiency, stores the _sums_ of the columns up to and including that index.
 * @param totalWidth - The total sum of all the widths of all the columns
 */
export interface WidthData {
    widthArray: number[];
    widthSumArray: number[];
    totalWidth: number;
}

/**
 * Stores the width data of the columns in the sheet.
 * The state of the grid is represented by a viewport with a height and width,
 * the scroll position of the scroller div in the viewport, and the selected 
 * range of cells within the grid.
 * 
 * We default the selection to -2s so that nothing is selected and all our selection
 * code doesn't need to handle too many special cases.
 * 
 * We store all of this state in a single object as if any of them change, the entire
 * grid (the data, the headers) needs to rerender. Thus, we don't want to set them
 * indivigually so that we can limit the amount of unnecessary rerendering we do.
 * 
 * Only put state in here that causes a rerender of the entire grid when any element changes
 * and is consistently passed as props to the grid and headers.
 * 
 * @param sheetIndex - The sheet that this grid state represents
 * @param viewport - The size of the viewport
 * @param scrollPosition - Scroll position in the grid
 * @param selections - Selected ranges
 * @param columnIDsArray - A mapping from sheetIndex -> columnIndex -> columnID
 * @param widthDataArray - A list of width data for each sheet
 */
export interface GridState {
    sheetIndex: number;
    viewport: Dimension;
    scrollPosition: ScrollPosition;
    selections: MitoSelection[];
    columnIDsArray: ColumnID[][];
    widthDataArray: WidthData[];
    searchString: string;
}

/**
 * An object storing all the data necessary to write a code cell.
 * 
 * @param imports - the import string
 * @param code - the lines of code to write to the cell
 */
export interface Code {
    imports: string;
    code: string[];
}


/**
 * The type of data that is in this current Mito analysis.
 * 
 * @remark this should be the same as the file in the Python code
 * which is in data_in_mito.py
 */
export enum DataTypeInMito {
    NONE = 'none',
    PROVIDED = 'provided',
    TUTORIAL = 'tutorial',
    PERSONAL = 'personal',
}

export enum FormatType {
    DEFAULT = 'default',
    PLAIN_TEXT = 'plain text',
    PERCENTAGE = 'percentage',
    CURRENCY = 'currency',
    ACCOUNTING = 'accounting',
    ROUND_DECIMALS = 'round decimals',
    K_M_B = 'k_m_b',
    SCIENTIFIC_NOTATION = 'scientific notation'
}

/**
 * The format applied to a specific column of data in Mito.
 */
export type FormatTypeObj = 
    | {
        type: FormatType.DEFAULT
    }
    | { 
        type: FormatType.PLAIN_TEXT // Removes commas + displays all decimal places
    }
    | {
        type: FormatType.PERCENTAGE // Shows a percentage representation
    } 
    | {
        type: FormatType.ACCOUNTING // shows $ and uses ( ) for negative numbers
    }
    | {
        type: FormatType.ROUND_DECIMALS // Rounds the number to the number of decimals given below
        numDecimals: number
    } 
    | {
        type: FormatType.K_M_B // Formats numbers with K for thousands, M for millions, and B for billions 
    } 
    | {
        type: FormatType.SCIENTIFIC_NOTATION // Just does scientific notiation
    } 

/**
 * An object representing all the data about the analysis that is occuring currently.
 * 
 * @param analysisName - the name of the analysis used for writing to the cell. NOT THE SAVED ANALYSIS NAME.
 * @param code - the transpiled code of this analysis
 * @param stepSummaryList - a list of step summaries for the steps in this analysis
 * @param currStepIdx - the index of the currently checked out step, in the stepSummaryList
 * @param dataTypeInTool - the type of data in the tool in this analysis
 */
export interface AnalysisData {
    analysisName: string,
    code: Code,
    stepSummaryList: StepSummary[],
    currStepIdx: number,
    dataTypeInTool: DataTypeInMito;
}

/**
 * An object represending this user
 * 
 * @param userEmail - the email of the user. May be an empty string if they have not signed up yet
 * @param receivedTours - a list of the tours they have received
 * @param isPro - if the user is a pro user
 * @param excelImportEnabled - if the user has the necessary packages optional dependencies, and Python and Pandas version to import Excel files.
 * @param telemetryEnabled - if the user has telemetry enabled
 * @param isLocalDeployment - if the user is deployed locally or not
 * @param shouldUpgradeMitosheet - if the user should upgrade their mitosheet
 * @param numUsages - the number of times the user has used the tool (maxes out at 50 currently)
 * @param usageTriggeredFeedbackID - the id of the usage triggered feedback id to display to the user
 */
export interface UserProfile {
    userEmail: string;
    receivedTours: string[];
    
    isPro: boolean;
    excelImportEnabled: boolean;
    telemetryEnabled: boolean;
    isLocalDeployment: boolean;
    shouldUpgradeMitosheet: boolean;
    numUsages: number;
    usageTriggeredFeedbackID: UsageTriggeredFeedbackID | undefined
}


/**
 * The different functions necessary to update the state of the Mito component
 * from outside the component (e.g. after receiving a message).
 */
export interface MitoStateUpdaters {
    setSheetDataArray: React.Dispatch<React.SetStateAction<SheetData[]>>,
    setAnalysisData: React.Dispatch<React.SetStateAction<AnalysisData>>,
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>,
    setUIState: React.Dispatch<React.SetStateAction<UIState>>,
}

export interface CSVExportState {exportType: 'csv'}
export interface ExcelExportState {exportType: 'excel', sheetIndexes: number[]}

/**
 * State of the UI, all in one place for ease.
 */
export interface UIState {
    // If this is greater than 0, then we're loading some messages
    // from the backend. Increment and decrement as messages are recieved,
    // which allows us to track mulitple messages at once, something a boolean
    // here would not allow
    loading: number; 
    currOpenModal: ModalInfo;
    currOpenTaskpane: TaskpaneInfo;
    selectedColumnControlPanelTab: ControlPanelTab;
    exportConfiguration: CSVExportState | ExcelExportState; 
    selectedSheetIndex: number;
    displayFormatToolbarDropdown: boolean
}

/**
 * The returned matches when searching a for a value in the sheet
 */
export interface SearchMatches {
    columnHeaderIndexes: {rowIndex: number, columnIndex: number}[];
    cellIndexes: {rowIndex: number, columnIndex: number}[];
}

/**
 * Used to identify the feedback that the user is prompted for. 
 * When we add new feedback options, add it here!
 */
export const enum FeedbackID {
    COMPANY = 'company/organization',
    SOURCE = 'source',
    MITO_GOAL = 'mito_goal',
    ADD_COLUMN_USAGE_TRIGGERED = 'add_column_usage_triggered',
    DELETE_COLUMN_USAGE_TRIGGERED = 'delete_column_usage_triggered',
    RENAME_COLUMN_USAGE_TRIGGERED = 'rename_column_usage_triggered',
    REORDER_COLUMN_USAGE_TRIGGERED = 'reorder_column_usage_triggered',
    FILTER_COLUMN_USAGE_TRIGGERED = 'filter_column_usage_triggered',
    SET_COLUMN_FORMULA_USAGE_TRIGGERED = 'set_column_formula_usage_triggered',
    DATAFRAME_DELETE_USAGE_TRIGGERED = 'dataframe_delete_usage_triggered',
    DATAFRAME_DUPLICATE_USAGE_TRIGGERED = 'dataframe_duplicate_usage_triggered',
    DATAFRAME_RENAME_USAGE_TRIGGERED = 'dataframe_rename_usage_triggered',
    SIMPLE_IMPORT_USAGE_TRIGGERED = 'simple_import_usage_triggered',
    SORT_USAGE_TRIGGERED = 'sort_usage_triggered',
    PIVOT_USAGE_TRIGGERED = 'pivot_usage_triggered',
    MERGE_USAGE_TRIGGERED = 'merge_usage_triggered',
    CHANGE_COLUMN_DTYPE_USAGE_TRIGGERED = 'change_column_dtype_usage_triggered',
    CHANGE_COLUMN_FORMAT_USAGE_TRIGGERED = 'change_column_format_usage_triggered',
    SET_CELL_VALUE_USAGE_TRIGGERED = 'set_cell_value_usage_triggered',
    EXCEL_IMPORT_USAGE_TRIGGERED = 'excel_import_usage_triggered',
    DROP_DUPLICATES_USAGE_TRIGGERED = 'drop_duplicates_usage_triggered'
} 

/**
 * The Feedback IDs of the usage triggered feedbacks
 */
export type UsageTriggeredFeedbackID = 
    FeedbackID.ADD_COLUMN_USAGE_TRIGGERED |
    FeedbackID.DELETE_COLUMN_USAGE_TRIGGERED | 
    FeedbackID.RENAME_COLUMN_USAGE_TRIGGERED |
    FeedbackID.REORDER_COLUMN_USAGE_TRIGGERED | 
    FeedbackID.FILTER_COLUMN_USAGE_TRIGGERED | 
    FeedbackID.SET_COLUMN_FORMULA_USAGE_TRIGGERED |
    FeedbackID.DATAFRAME_DELETE_USAGE_TRIGGERED |
    FeedbackID.DATAFRAME_DUPLICATE_USAGE_TRIGGERED |
    FeedbackID.DATAFRAME_RENAME_USAGE_TRIGGERED |
    FeedbackID.SIMPLE_IMPORT_USAGE_TRIGGERED |
    FeedbackID.SORT_USAGE_TRIGGERED |
    FeedbackID.PIVOT_USAGE_TRIGGERED |
    FeedbackID.MERGE_USAGE_TRIGGERED |
    FeedbackID.CHANGE_COLUMN_DTYPE_USAGE_TRIGGERED |
    FeedbackID.CHANGE_COLUMN_FORMAT_USAGE_TRIGGERED |
    FeedbackID.SET_CELL_VALUE_USAGE_TRIGGERED |
    FeedbackID.EXCEL_IMPORT_USAGE_TRIGGERED |
    FeedbackID.DROP_DUPLICATES_USAGE_TRIGGERED


/*
    ActionEnum is used to identify a specific action.

    Listed in alphabetical order: first by non-spreadsheet functions,
    then by spreadsheet functions
*/
export enum ActionEnum {
    Add_Column = 'add column',
    Clear = 'clear',
    Change_Dtype = 'change dtype',
    Column_Summary = 'column summary',
    Delete_Column = 'delete column',
    Delete_Sheet = 'delete sheet',
    Drop_Duplicates = 'drop duplicates',
    Duplicate_Sheet = 'duplicate sheet',
    Docs = 'docs',
    Export = 'export',
    Filter = 'filter',
    Format = 'format',
    Fullscreen = 'fullscreen',
    Graph = 'graph',
    Help = 'help',
    Import = 'import',
    Merge = 'merge',
    Pivot = 'pivot',
    Redo = 'redo',
    Rename_Column = 'rename column',
    Rename_Sheet = 'rename sheet',
    See_All_Functionality = 'see all functionality',
    //Search = 'search',
    Set_Cell_Value = 'set cell value',
    Set_Column_Formula = 'set column formula',
    Sort = 'sort',
    Steps = 'steps',
    Undo = 'undo',
    Unique_Values = 'unique values',
    /* Spreadsheet Formulas Section */
    ABS = 'abs',
    AND = 'and',
    AVG = 'avg',
    BOOL = 'bool',
    CLEAN = 'clean',
    CONCAT = 'concat',
    CORR = 'corr',
    DATEVALUE = 'datevalue',
    DAY = 'day',
    ENDOFBUSINESSMONTH = 'endofbusinessmonth',
    ENDOFMONTH = 'endofmonth',
    EXP = 'exp',
    FILLNAN = 'fillnan',
    FIND = 'find',
    HOUR = 'hour',
    IF = 'if',
    KURT = 'kurt',
    LEFT = 'left',
    LEN = 'len',
    LOWER = 'lower',
    MAX = 'max',
    MID = 'mid',
    MIN = 'min',
    MINUTE = 'minute',
    MONTH = 'month',
    MULTIPLY = 'multiply',
    OR = 'or',
    POWER = 'power',
    PROPER = 'proper',
    QUARTER = 'quarter',
    RIGHT = 'right',
    ROUND = 'round',
    SECOND = 'second',
    SKEW = 'skew',
    STARTOFBUSINESSMONTH = 'startofbusinessmonth',
    STARTOFMONTH = 'startofmonth',
    STRIPTIMETOMINUTES = 'striptimetominutes',
    STRIPTIMETOHOURS = 'striptimetohours',
    STRIPTIMETODAYS = 'striptimetodays',
    STRIPTIMETOMONTHS = 'striptimetomonths',
    STRIPTIMETOYEARS = 'striptimetoyears',
    SUBSTITUTE = 'substitute',
    SUM = 'sum',
    TEXT = 'text',
    TRIM = 'trim',
    TYPE = 'type',
    UPPER = 'upper',
    VALUE = 'value',
    VAR = 'var',
    WEEK = 'week',
    WEEEKDAY = 'weekday',
    YEAR = 'year',
}

// These actions should be used in the toolbar, in search, and 
// anywhere else the action is performed. That is why we call it Action
export interface Action {
    // We store the type of the action so that we can introspect the type of the variable
    type: ActionEnum;

    // The short title for the action. Should be lowercase.
    shortTitle: string

    // The optional long title for the action.
    longTitle?: string

    /* 
        The function to call if the action is taken by the user. This should
        not require any parameters to be called, as all the necessary data
        for the calling of this action should be created when it is constructed
        NOTE: this no param usage is what we do in the toolbar, and it works
        really well to allow the caller to be able to use this action without
        having to know anything about it
    */
    actionFunction: () => void; 
    
    // A list of the search terms that can be used to discover this action
    searchTerms: string[]

    /*
        The function to call to determine if the action is enabled or not,
        which returns a string with the reason for being disabled, or undefined
        if the action is not disabled. 

        Some basic rules of thumb:
        1.  An action that opens an interface that lets the user select a datasource is only
            disabled if no sheet exists in Mito
        2.  An action that relies on a specific column, is only disabled if that column does not exist. 
        3.  An action that does not rely on the state of Mito (ie: opening full screen mode) is never disabled.
    */
    isDisabled: () => string | undefined

    // The tooltip to display in the toolbar or search bar when this is hovered over
    tooltip: string

    // Optionally categorize the action, so it can easily be sorted later
    category?: 'spreadsheet formula'
}

export interface ExcelFileMetadata {
    sheet_names: string[]
    size: number
}