( function ( blocks, element, blockEditor, components ) {
	var el = element.createElement;
	var registerBlockType = blocks.registerBlockType;
	var useBlockProps = blockEditor.useBlockProps;
	var TextControl = components.TextControl;
	var TextareaControl = components.TextareaControl;
	var SelectControl = components.SelectControl;

	registerBlockType( 'tvgf/callout', {
		edit: function ( props ) {
			var a = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps( {
				className: 'tvgf-callout-edit tvgf-callout-' + a.variant,
			} );

			return el(
				'div',
				blockProps,
				el( SelectControl, {
					label: 'Type',
					value: a.variant,
					options: [
						{ label: 'Insight', value: 'insight' },
						{ label: 'Warning / Risk', value: 'warning' },
					],
					onChange: function ( v ) {
						setAttributes( { variant: v } );
					},
				} ),
				el( TextControl, {
					label: 'Title (optional)',
					value: a.title,
					onChange: function ( v ) {
						setAttributes( { title: v } );
					},
				} ),
				el( TextareaControl, {
					label: 'Body',
					value: a.body,
					onChange: function ( v ) {
						setAttributes( { body: v } );
					},
				} )
			);
		},
		save: function ( props ) {
			var a = props.attributes;
			var blockProps = blockEditor.useBlockProps.save( {
				className: 'tvgf-callout tvgf-callout-' + a.variant,
			} );
			return el(
				'div',
				blockProps,
				a.title ? el( 'div', { className: 'tvgf-callout-title' }, a.title ) : null,
				el( 'p', { className: 'tvgf-callout-body' }, a.body )
			);
		},
	} );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components );
