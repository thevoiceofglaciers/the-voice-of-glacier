( function ( blocks, element, blockEditor, components ) {
	var el = element.createElement;
	var registerBlockType = blocks.registerBlockType;
	var useBlockProps = blockEditor.useBlockProps;
	var TextControl = components.TextControl;
	var TextareaControl = components.TextareaControl;
	var SelectControl = components.SelectControl;

	function renderPreview( a, rootProps ) {
		return el(
			'div',
			rootProps || { className: 'tvgf-callout tvgf-callout-' + a.variant },
			a.title ? el( 'div', { className: 'tvgf-callout-title' }, a.title ) : null,
			el( 'p', { className: 'tvgf-callout-body' }, a.body || 'Callout body text…' )
		);
	}

	registerBlockType( 'tvgf/callout', {
		edit: function ( props ) {
			var a = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps( { className: 'tvgf-callout-edit' } );

			return el(
				'div',
				blockProps,
				el( 'p', { className: 'tvgf-block-label' }, 'Callout — preview' ),
				renderPreview( a ),
				el( 'p', { className: 'tvgf-block-label' }, 'Edit' ),
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
			return renderPreview( a, blockProps );
		},
	} );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components );
