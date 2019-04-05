import {updateObject} from "../../../helpers/utils";
import {hasErrors} from "../../app/model/helpers/model";

const BIKE_OR_PARTS = "A quote must either have a bike selected or have parts added.";
const BIKE_PRICES_REQUIRED = "Bike prices are required to calculate the quote price";
const CUSTOMER_REQUIRED = "A customer should be selected";
const QUOTE_PART_ERRORS = "Parts need amending before quote can be saved.";
const MULTIPLE_REPLACEMENT_PARTS = "Multiple replacement parts - only one allowed per bike part";

