( function ( blocks, element, blockEditor, components ) {
	var el = element.createElement;
	var registerBlockType = blocks.registerBlockType;
	var useBlockProps = blockEditor.useBlockProps;
	var TextControl = components.TextControl;
	var TextareaControl = components.TextareaControl;
	var SelectControl = components.SelectControl;

	var COLOR_OPTIONS = [
		{ label: 'Teal', value: 'teal' },
		{ label: 'Navy', value: 'navy' },
	];

	function renderPreview( a, rootProps ) {
		return el(
			'div',
			rootProps || { className: 'tvgf-two-phase' },
			el(
				'div',
				{ className: 'tvgf-phase-header tvgf-phase-' + a.leftColor },
				a.leftHeader || 'Phase 1 header…'
			),
			el(
				'div',
				{ className: 'tvgf-phase-header tvgf-phase-' + a.rightColor },
				a.rightHeader || 'Phase 2 header…'
			),
			el(
				'div',
				{ className: 'tvgf-phase-body tvgf-phase-left' },
				el(
					'p',
					{},
					el( 'strong', {}, a.leftLead ),
					a.leftLead ? ' ' : null,
					a.leftText || 'Phase 1 description…'
				)
			),
			el(
				'div',
				{ className: 'tvgf-phase-body tvgf-phase-right' },
				el(
					'p',
					{},
					el( 'strong', {}, a.rightLead ),
					a.rightLead ? ' ' : null,
					a.rightText || 'Phase 2 description…'
				)
			)
		);
	}

	registerBlockType( 'tvgf/two-phase', {
		edit: function ( props ) {
			var a = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps( { className: 'tvgf-two-phase-edit' } );

			function set( field ) {
				return function ( v ) {
					var next = {};
					next[ field ] = v;
					setAttributes( next );
				};
			}

			return el(
				'div',
				blockProps,
				el( 'p', { className: 'tvgf-block-label' }, 'Two Phase — preview' ),
				renderPreview( a ),
				el( 'p', { className: 'tvgf-block-label' }, 'Phase 1 (left)' ),
				el( TextControl, { label: 'Header', value: a.leftHeader, onChange: set( 'leftHeader' ) } ),
				el( SelectControl, {
					label: 'Header color',
					value: a.leftColor,
					options: COLOR_OPTIONS,
					onChange: set( 'leftColor' ),
				} ),
				el( TextControl, { label: 'Lead phrase (bold)', value: a.leftLead, onChange: set( 'leftLead' ) } ),
				el( TextareaControl, { label: 'Description', value: a.leftText, onChange: set( 'leftText' ) } ),
				el( 'p', { className: 'tvgf-block-label' }, 'Phase 2 (right)' ),
				el( TextControl, { label: 'Header', value: a.rightHeader, onChange: set( 'rightHeader' ) } ),
				el( SelectControl, {
					label: 'Header color',
					value: a.rightColor,
					options: COLOR_OPTIONS,
					onChange: set( 'rightColor' ),
				} ),
				el( TextControl, { label: 'Lead phrase (bold)', value: a.rightLead, onChange: set( 'rightLead' ) } ),
				el( TextareaControl, { label: 'Description', value: a.rightText, onChange: set( 'rightText' ) } )
			);
		},
		save: function ( props ) {
			var blockProps = blockEditor.useBlockProps.save( { className: 'tvgf-two-phase' } );
			return renderPreview( props.attributes, blockProps );
		},
	} );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components );
