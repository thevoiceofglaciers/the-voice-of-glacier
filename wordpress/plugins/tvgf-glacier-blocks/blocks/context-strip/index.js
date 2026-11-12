( function ( blocks, element, blockEditor, components ) {
	var el = element.createElement;
	var registerBlockType = blocks.registerBlockType;
	var useBlockProps = blockEditor.useBlockProps;
	var TextControl = components.TextControl;
	var Button = components.Button;

	function withItem( items, index, field, value ) {
		var next = items.slice();
		next[ index ] = Object.assign( {}, next[ index ], {} );
		next[ index ][ field ] = value;
		return next;
	}

	function renderPreview( items, rootProps ) {
		return el(
			'div',
			rootProps || { className: 'tvgf-context-strip' },
			items.map( function ( item, index ) {
				return el(
					'div',
					{ key: index, className: 'tvgf-context-item' },
					el( 'span', { className: 'tvgf-context-icon' }, item.icon ),
					el(
						'div',
						{},
						el( 'div', { className: 'tvgf-context-label' }, item.label ),
						el( 'div', { className: 'tvgf-context-value' }, item.value )
					)
				);
			} )
		);
	}

	registerBlockType( 'tvgf/context-strip', {
		edit: function ( props ) {
			var items = props.attributes.items || [];
			var setAttributes = props.attributes && props.setAttributes;
			var blockProps = useBlockProps( { className: 'tvgf-context-strip-edit' } );

			return el(
				'div',
				blockProps,
				el( 'p', { className: 'tvgf-block-label' }, 'Context Strip — preview' ),
				renderPreview( items ),
				el( 'p', { className: 'tvgf-block-label' }, 'Edit items' ),
				items.map( function ( item, index ) {
					return el(
						'div',
						{ key: index, className: 'tvgf-context-strip-row' },
						el( TextControl, {
							label: 'Icon (emoji)',
							value: item.icon || '',
							onChange: function ( v ) {
								props.setAttributes( { items: withItem( items, index, 'icon', v ) } );
							},
						} ),
						el( TextControl, {
							label: 'Label',
							value: item.label || '',
							onChange: function ( v ) {
								props.setAttributes( { items: withItem( items, index, 'label', v ) } );
							},
						} ),
						el( TextControl, {
							label: 'Value',
							value: item.value || '',
							onChange: function ( v ) {
								props.setAttributes( { items: withItem( items, index, 'value', v ) } );
							},
						} ),
						el(
							Button,
							{
								isDestructive: true,
								variant: 'secondary',
								onClick: function () {
									var next = items.slice();
									next.splice( index, 1 );
									props.setAttributes( { items: next } );
								},
							},
							'Remove'
						)
					);
				} ),
				el(
					Button,
					{
						variant: 'primary',
						onClick: function () {
							props.setAttributes( {
								items: items.concat( [ { icon: '', label: '', value: '' } ] ),
							} );
						},
					},
					'+ Add item'
				)
			);
		},
		save: function ( props ) {
			var blockProps = blockEditor.useBlockProps.save( { className: 'tvgf-context-strip' } );
			return renderPreview( props.attributes.items || [], blockProps );
		},
	} );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components );
