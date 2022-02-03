#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Mito.
# Distributed under the terms of the Modified BSD License.

"""
Exports the transpile function, which takes the backend widget
container and generates transpiled Python code.
"""

from typing import TYPE_CHECKING, Any
from mitosheet.preprocessing import PREPROCESS_STEP_PERFORMERS
from mitosheet.transpiler.transpile_utils import get_steps_to_transpile

if TYPE_CHECKING:
    from mitosheet.steps_manager import StepsManager
else:
    StepsManager = Any

IN_PREVIOUS_STEP_COMMENT = '# You\'re viewing a previous step. Click fast forward in the Mitosheet above to see the full analysis.'

def transpile(steps_manager: StepsManager, add_comments=True):
    """
    Transpiles the code from the current steps in the steps_manager, 
    displaying up to the checked out step.

    If add_comments, then adds descriptive comments using the step 
    describe functions. 
    """

    code = []

    # First, we transpile all the preprocessing steps
    for preprocess_step_performer in PREPROCESS_STEP_PERFORMERS:
        preprocess_code = preprocess_step_performer.transpile(
            steps_manager,
            steps_manager.preprocess_execution_data[preprocess_step_performer.preprocess_step_type()]
        )
        if len(preprocess_code) > 0:
            code.extend(preprocess_code)

    # We only transpile up to the currently checked out step
    steps_to_transpile = get_steps_to_transpile(steps_manager)
    for step in steps_to_transpile:
        # Skip the initalize step, or any step we should skip
        if step.step_type == 'initialize':
            continue

        # The total code for this step
        step_code = []

        # NOTE: we add a comment if add_comment is True
        if add_comments:
            step_code.append(
                '# ' + step.step_performer.describe(
                    **step.params,
                    df_names=step.df_names
                )
            )
        
        transpiled_code = step.step_performer.transpile(
            step.prev_state,
            step.post_state,
            step.execution_data,
            **step.params
        )
        
        # Make sure to not generate comments or code for steps with no code 
        if len(transpiled_code) > 0:

            step_code.extend(
                transpiled_code
            )
            
            code.extend(step_code)

    # If we have a historical step checked out, then we add a comment letting
    # the user know this is the case
    if steps_manager.curr_step_idx != len(steps_manager.steps) - 1:
        code.append(IN_PREVIOUS_STEP_COMMENT)

    return {
        'imports': f'from mitosheet import *',
        'code': code
    }
